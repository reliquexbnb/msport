"use client";

import type { AnatomyStage } from "@/lib/schema";
import { AnatomySignature, AnatomyChips } from "./AnatomySignature";

/**
 * The Anatomy as rendered inside a finished analysis. Thin adapter over the
 * shared signature component so marketing and product show the same object.
 */
export function AnatomyPath({
  stages,
  animate = true,
  compact = false,
}: {
  stages: AnatomyStage[];
  animate?: boolean;
  compact?: boolean;
}) {
  return (
    <AnatomySignature
      animate={animate}
      variant={compact ? "compact" : "full"}
      stages={stages.map((s) => ({
        stage: s.stage,
        title: s.title,
        detail: s.explanation,
      }))}
    />
  );
}

export { AnatomyChips as AnatomyPathPreview };
