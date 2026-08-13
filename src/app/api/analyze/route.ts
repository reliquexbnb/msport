import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { hasModel, resolveModel, samplingOptions } from "@/lib/ai";
import { AnatomySchema, type AnalysisResult, type SourceInfo } from "@/lib/schema";
import { ANATOMY_SYSTEM_PROMPT, anatomyUserPrompt } from "@/lib/prompts";
import { extractFromUrl } from "@/lib/extract";
import { LIMITS, MODES, type ModeId } from "@/lib/config";

export const runtime = "nodejs";
export const maxDuration = 120;

const BodySchema = z.object({
  input: z.string().min(1).max(LIMITS.maxInputChars),
  kind: z.enum(["ask", "paste", "url"]),
  mode: z.enum(["story", "game", "player", "team", "interview", "podcast"]),
});

function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export async function POST(req: Request) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "That request wasn't valid." }, { status: 400 });
  }

  const mode = body.mode as ModeId;

  // ---- Resolve the material -------------------------------------------------
  let material = body.input.trim();
  let source: SourceInfo = { kind: body.kind };

  if (body.kind === "url") {
    const extracted = await extractFromUrl(material);
    if (!extracted.ok) {
      return NextResponse.json({ error: extracted.reason, kind: "extract" }, { status: 422 });
    }
    material = extracted.text;
    source = extracted.source;
  } else {
    material = material.slice(0, LIMITS.maxInputChars);
    if (body.kind === "paste") {
      source = { kind: "paste", excerpt: material.slice(0, 180) };
    } else {
      source = { kind: "ask", title: material.slice(0, 180) };
    }
  }

  if (!hasModel()) {
    return NextResponse.json(
      { error: "The analysis service isn't configured. Add an API key on the server." },
      { status: 503 }
    );
  }

  // ---- Analysis -------------------------------------------------------------
  try {
    const { object } = await generateObject({
      model: resolveModel(),
      schema: AnatomySchema,
      system: ANATOMY_SYSTEM_PROMPT,
      prompt: anatomyUserPrompt({ mode, input: material, source }),
      ...samplingOptions(0.4),
      maxRetries: 2,
    });

    const result: AnalysisResult = {
      anatomy: object,
      mode,
      source,
      createdAt: new Date().toISOString(),
      id: newId(),
    };

    return NextResponse.json({ result });
  } catch (err) {
    console.error("[mSport] analyze failed:", err);
    const label = MODES.find((m) => m.id === mode)?.label ?? "analysis";
    return NextResponse.json(
      {
        error: `The ${label} analysis didn't complete. Try again, or shorten the material if it's very long.`,
      },
      { status: 502 }
    );
  }
}
