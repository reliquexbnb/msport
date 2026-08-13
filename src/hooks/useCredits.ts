"use client";

import { useCallback, useSyncExternalStore } from "react";
import { CREDITS } from "@/lib/config";

/**
 * Anonymous free-trial credits.
 *
 * The MVP tracks these in localStorage, read through useSyncExternalStore so
 * the server render and the first client render agree and every mounted
 * component stays in sync. The surface here (remaining / consume / reset) is
 * deliberately narrow so it can be swapped for server-side anonymous credits —
 * keyed on a signed cookie — without touching callers.
 */

const EVENT = "msport:credits";

type Stored = { remaining: number; version: 1 };

function clamp(n: number): number {
  return Math.max(0, Math.min(CREDITS.freeAnalyses, Math.floor(n)));
}

function read(): number {
  try {
    const raw = window.localStorage.getItem(CREDITS.storageKey);
    if (!raw) return CREDITS.freeAnalyses;
    const parsed = JSON.parse(raw) as Stored;
    if (typeof parsed?.remaining !== "number" || Number.isNaN(parsed.remaining)) {
      return CREDITS.freeAnalyses;
    }
    return clamp(parsed.remaining);
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
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Server and first-client snapshot agree, so nothing flashes on hydration. */
const serverSnapshot = () => CREDITS.freeAnalyses;

export function useCredits() {
  const remaining = useSyncExternalStore(subscribe, read, serverSnapshot);
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const consume = useCallback(() => {
    const next = Math.max(0, read() - 1);
    write(next);
    return next;
  }, []);

  const reset = useCallback(() => {
    write(CREDITS.freeAnalyses);
  }, []);

  return {
    remaining,
    /** False during SSR and the first paint, so labels don't flicker. */
    ready: mounted,
    consume,
    reset,
    exhausted: mounted && remaining <= 0,
    total: CREDITS.freeAnalyses,
  };
}

export function creditLabel(remaining: number): string {
  if (remaining <= 0) return "No free analyses remaining";
  if (remaining === 1) return "1 free analysis remaining";
  return `${remaining} free analyses remaining`;
}
