import "server-only";

import dns from "node:dns/promises";
import net from "node:net";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { LIMITS } from "./config";
import type { SourceInfo } from "./schema";

export type ExtractResult =
  | { ok: true; text: string; source: SourceInfo }
  | { ok: false; reason: string };

export const EXTRACT_FAILURE_MESSAGE =
  "We couldn't reliably read this page. Paste the article or notes here instead.";

/* ------------------------------------------------------------------ */
/* SSRF protection                                                     */
/* ------------------------------------------------------------------ */

function isPrivateIPv4(ip: string): boolean {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => Number.isNaN(n))) return true;
  const [a, b] = p;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true; // link-local / cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a >= 224) return true; // multicast + reserved
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const v = ip.toLowerCase().replace(/^\[|\]$/g, "");
  if (v === "::1" || v === "::") return true;
  if (v.startsWith("fc") || v.startsWith("fd")) return true; // unique local
  if (v.startsWith("fe80")) return true; // link-local
  if (v.startsWith("::ffff:")) return isPrivateIPv4(v.slice(7));
  return false;
}

function isPrivateAddress(ip: string): boolean {
  if (net.isIPv4(ip)) return isPrivateIPv4(ip);
  if (net.isIPv6(ip)) return isPrivateIPv6(ip);
  return true;
}

/** Validate protocol, hostname and every resolved address before fetching. */
export async function assertSafeUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http and https URLs can be read.");
  }

  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");

  if (
    host === "localhost" ||
    host === "0.0.0.0" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    throw new Error("That host can't be read.");
  }

  if (net.isIP(host) && isPrivateAddress(host)) {
    throw new Error("That host can't be read.");
  }

  if (!net.isIP(host)) {
    let addresses: { address: string }[];
    try {
      addresses = await dns.lookup(host, { all: true });
    } catch {
      throw new Error("We couldn't resolve that domain.");
    }
    if (addresses.length === 0 || addresses.some((a) => isPrivateAddress(a.address))) {
      throw new Error("That host can't be read.");
    }
  }

  return url;
}

/* ------------------------------------------------------------------ */
/* Fetch + extract                                                     */
/* ------------------------------------------------------------------ */

async function fetchWithLimits(url: URL): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LIMITS.urlTimeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent": "mSportBot/1.0 (+https://msport.asia)",
        accept: "text/html,application/xhtml+xml",
        "accept-language": "en",
      },
    });

    if (!res.ok) throw new Error(`The page returned ${res.status}.`);

    const type = res.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml|text\/plain/i.test(type)) {
      throw new Error("That link isn't a readable web page.");
    }

    const declared = Number(res.headers.get("content-length") ?? 0);
    if (declared && declared > LIMITS.urlMaxBytes) {
      throw new Error("That page is too large to read.");
    }

    if (!res.body) throw new Error("That page returned no content.");

    // Stream with a hard byte ceiling so a huge or endless response can't
    // exhaust memory even when content-length lies.
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > LIMITS.urlMaxBytes) {
        await reader.cancel();
        throw new Error("That page is too large to read.");
      }
      chunks.push(value);
    }

    return new TextDecoder("utf-8").decode(await new Blob(chunks as BlobPart[]).arrayBuffer());
  } finally {
    clearTimeout(timer);
  }
}

function meta(doc: Document, names: string[]): string | undefined {
  for (const n of names) {
    const el =
      doc.querySelector(`meta[property="${n}"]`) ?? doc.querySelector(`meta[name="${n}"]`);
    const v = el?.getAttribute("content")?.trim();
    if (v) return v;
  }
  return undefined;
}

function tidy(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function extractFromUrl(raw: string): Promise<ExtractResult> {
  let url: URL;
  try {
    url = await assertSafeUrl(raw);
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "That URL can't be read." };
  }

  let html: string;
  try {
    html = await fetchWithLimits(url);
  } catch (err) {
    const reason =
      err instanceof Error && err.name === "AbortError"
        ? "That page took too long to respond."
        : err instanceof Error
          ? err.message
          : "We couldn't reach that page.";
    return { ok: false, reason };
  }

  try {
    const dom = new JSDOM(html, { url: url.toString() });
    const doc = dom.window.document;

    const publication =
      meta(doc, ["og:site_name", "application-name"]) ?? url.hostname.replace(/^www\./, "");
    const author = meta(doc, ["author", "article:author", "twitter:creator"]);
    const publishedAt = meta(doc, [
      "article:published_time",
      "datePublished",
      "date",
      "og:updated_time",
    ]);
    const ogTitle = meta(doc, ["og:title", "twitter:title"]);

    const article = new Readability(doc).parse();

    const body = tidy(article?.textContent ?? doc.body?.textContent ?? "");
    const title = (article?.title || ogTitle || doc.title || "").trim();

    // Too little text almost always means a paywall, a JS-rendered page or a
    // consent interstitial. Do not hand that to the model as if it were a story.
    if (body.length < 600) {
      return { ok: false, reason: EXTRACT_FAILURE_MESSAGE };
    }

    const source: SourceInfo = {
      kind: "url",
      url: url.toString(),
      title: title || undefined,
      publication,
      author: author || undefined,
      publishedAt: publishedAt || undefined,
      excerpt: article?.excerpt?.trim() || undefined,
    };

    const header = [
      title ? `Headline: ${title}` : "",
      publication ? `Publication: ${publication}` : "",
      author ? `Author: ${author}` : "",
      publishedAt ? `Published: ${publishedAt}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const text = `${header}\n\n${body}`.slice(0, LIMITS.maxInputChars);

    return { ok: true, text, source };
  } catch {
    return { ok: false, reason: EXTRACT_FAILURE_MESSAGE };
  }
}
