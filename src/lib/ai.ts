import "server-only";

import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

/**
 * Provider resolution.
 *
 * Anthropic is the preferred provider. OpenAI is used as a fallback so the
 * product stays functional wherever a key is available. If neither key is
 * present the analysis routes return a 503 rather than fabricating a result.
 *
 * Keys are read only in server modules. They are never sent to the browser.
 */

export type ProviderName = "anthropic" | "openai" | "none";

export function activeProvider(): ProviderName {
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "none";
}

export function hasModel(): boolean {
  return activeProvider() !== "none";
}

export function resolveModel(): LanguageModel {
  const provider = activeProvider();
  if (provider === "anthropic") {
    return anthropic(process.env.ANTHROPIC_MODEL || "claude-sonnet-5");
  }
  if (provider === "openai") {
    return openai(process.env.OPENAI_MODEL || "gpt-5.2");
  }
  throw new Error("No model provider configured.");
}

/**
 * Sampling controls that the active provider actually honours.
 * OpenAI's reasoning models reject `temperature`, so it is only sent to
 * Anthropic.
 */
export function samplingOptions(temperature: number): { temperature?: number } {
  return activeProvider() === "anthropic" ? { temperature } : {};
}
