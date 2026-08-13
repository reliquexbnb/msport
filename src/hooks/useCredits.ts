"use client";

import { useCallback, useEffect, useState } from "react";
import { CREDITS } from "@/lib/config";

/**
 * Anonymous free-trial credits.
 *
 * The MVP tracks these in localStorage. The surface here (read / consume /
 * remaining) is deliberately narrow so it can be swapped for server-side
 * anonymous credits — keyed on a signed cookie — without touching callers.
 */

const EVENT = "msport:credits";

type Stored = { remaining: number; version: 1 };

function read(): number {
  if (typeof window === "undefined") return CREDITS.freeAnalyses;
  try {
    const raw = window.localStorage.getItem(CREDITS.storageKey);
    if (!raw) return CREDITS.freeAnalyses;
    const parsed = JSON.parse(raw) as Stored;
    if (typeof parsed?.remaining !== "number" || Number.isNaN(parsed.remaining)) {
      return CREDITS.freeAnalyses;
    }
    return Math.max(0, Math.min(CREDITS.freeAnalyses, Math.floor(parsed.remaining)));
  } catch {
    return CREDITS.freeAnalyses;
  }
}

function write(remaining: number) {
  try {
    window.localStorage.setItem(
      CREDITS.storageKey,
      JSON.stringify({ remaining, version: 1 } satisfies Stored)
    );
  } catch {
    /* private mode — credits simply won't persist */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useCredits() {
  // Start from the default so server and first client render agree, then
  // hydrate from storage.
  const [remaining, setRemaining] = useState<number>(CREDITS.freeAnalyses);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRemaining(read());
    setReady(true);

    const sync = () => setRemaining(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const consume = useCallback(() => {
    const next = Math.max(0, read() - 1);
    write(next);
    setRemaining(next);
    return next;
  }, []);

  const reset = useCallback(() => {
    write(CREDITS.freeAnalyses);
    setRemaining(CREDITS.freeAnalyses);
  }, []);

  return {
    remaining,
    ready,
    consume,
    reset,
    exhausted: ready && remaining <= 0,
    total: CREDITS.freeAnalyses,
  };
}

export function creditLabel(remaining: number): string {
  if (remaining <= 0) return "No free analyses remaining";
  if (remaining === 1) return "1 free analysis remaining";
  return `${remaining} free analyses remaining`;
}
