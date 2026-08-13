import Link from "next/link";
import { BRAND, FOOTER_LINKS } from "@/lib/config";
import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  return (
    <footer className="no-print mt-auto border-t border-line bg-surface/60">
      <div className="mx-auto w-full max-w-[1240px] px-5 py-12 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Wordmark size="lg" />
            <p className="mt-4 max-w-[30ch] text-[16px] leading-relaxed text-ink-soft">
              {BRAND.tagline}
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-14 gap-y-3 sm:flex sm:gap-10">
            <div className="flex flex-col gap-3">
              {FOOTER_LINKS.slice(0, 3).map((l) => (
                <FooterLink key={l.href} {...l} />
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {FOOTER_LINKS.slice(3).map((l) => (
                <FooterLink key={l.href} {...l} />
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line-soft pt-6 text-[13.5px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {BRAND.name}</p>
          <p>{BRAND.domain}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const cls = "text-[15px] text-ink-soft transition-colors hover:text-ink";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}
