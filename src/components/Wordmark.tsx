import Link from "next/link";

/**
 * The mSport brand mark: an interlocking monogram whose two strokes read as a
 * path with a turn in it — movement and analysis, no ball and no shield.
 */
export function LogoMark({
  size = 22,
  className = "",
  color = "currentColor",
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      aria-hidden
      focusable="false"
    >
      <g
        transform="translate(-106.9 -121.3) scale(2.1)"
        fill="none"
        stroke={color}
        strokeWidth="17"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 66.6 132.4 V 78.4 A 10.2 10.2 0 0 1 87 78.4 V 107.6" />
        <path d="M 88.6 132.4 H 99.8 A 10.2 10.2 0 0 0 110 122.2 V 77.6 A 10.2 10.2 0 0 1 130.4 77.6 V 132.4" />
      </g>
    </svg>
  );
}

/**
 * The lockup. The lowercase m is intentional — the mark carries the colour, so
 * the wordmark itself stays in ink.
 */
export function Wordmark({
  className = "",
  size = "md",
  mark = true,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  mark?: boolean;
}) {
  const { text, glyph, gap } = {
    sm: { text: "text-[15px]", glyph: 18, gap: "gap-1.5" },
    md: { text: "text-[19px]", glyph: 22, gap: "gap-2" },
    lg: { text: "text-[26px]", glyph: 30, gap: "gap-2.5" },
  }[size];

  return (
    <span className={`inline-flex select-none items-center ${gap} ${className}`}>
      {mark ? <LogoMark size={glyph} color="var(--color-orange-deep)" /> : null}
      <span className={`font-medium tracking-[-0.03em] text-ink ${text}`}>
        <span className="text-orange-deep">m</span>
        <span className="-ml-[0.045em]">Sport</span>
      </span>
    </span>
  );
}

export function WordmarkLink({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="mSport home" className={`inline-flex items-center ${className}`}>
      <Wordmark />
    </Link>
  );
}
