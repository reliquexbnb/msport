"use client";

import { useState } from "react";

/**
 * Photography with a designed fallback.
 *
 * Drop hero.jpg / story.jpg / interview.jpg / podcast.jpg / context.jpg (or
 * .png / .webp) into /public/images and they take over automatically. Until
 * then each slot renders a tuned atmospheric gradient in the same palette, so
 * the site never looks unfinished.
 */

export type ImageSlot = "hero" | "story" | "interview" | "podcast" | "context";

const FALLBACKS: Record<ImageSlot, string> = {
  hero: "linear-gradient(168deg,#8e9db8 0%,#a8b1c4 26%,#c9b6a8 52%,#f0a271 72%,#f4ddc6 88%,#f4f0e8 100%)",
  story:
    "linear-gradient(150deg,#f6a76e 0%,#ef8449 38%,#d9694a 68%,#9aa4bd 100%)",
  interview:
    "linear-gradient(155deg,#7d8ba6 0%,#a9a49c 45%,#e8b18a 78%,#f3d9c2 100%)",
  podcast:
    "linear-gradient(200deg,#3e4552 0%,#6b7183 40%,#b4805f 78%,#ef8b52 100%)",
  context:
    "linear-gradient(160deg,#aeb9cd 0%,#cdc6bb 44%,#eba97c 76%,#f6e2cd 100%)",
};

const EXTENSIONS = ["jpg", "png", "webp", "jpeg"];

export function EditorialImage({
  slot,
  alt,
  className = "",
  imgClassName = "",
  priority = false,
  children,
}: {
  slot: ImageSlot;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  const [attempt, setAttempt] = useState(0);
  const exhausted = attempt >= EXTENSIONS.length;

  return (
    <div
      className={`relative isolate overflow-hidden bg-surface-sunk ${className}`}
      style={{ backgroundImage: FALLBACKS[slot] }}
    >
      {!exhausted ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={EXTENSIONS[attempt]}
          src={`/images/${slot}.${EXTENSIONS[attempt]}`}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onError={() => setAttempt((a) => a + 1)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <span className="sr-only">{alt}</span>
      )}
      {children}
    </div>
  );
}
