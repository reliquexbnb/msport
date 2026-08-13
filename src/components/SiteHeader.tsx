"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV } from "@/lib/config";
import { WordmarkLink } from "./Wordmark";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line-soft bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] w-full max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <WordmarkLink />

        <nav className="hidden items-center gap-2 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-2 text-[15px] transition-colors ${
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/analyze"
            className="ml-3 inline-flex h-10 items-center rounded-full bg-ink px-5 text-[14.5px] font-medium text-paper transition-all duration-200 hover:bg-[#26251f] hover:shadow-[0_8px_20px_-8px_rgba(53,52,49,0.6)]"
          >
            Try mSport
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-ink/[0.05] md:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            {open ? (
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            ) : (
              <path d="M2.5 6h13M2.5 12h13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="animate-fade border-t border-line-soft bg-paper px-5 pb-5 pt-2 md:hidden">
          <div className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line-soft py-3.5 text-[16px] text-ink-soft transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/analyze"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-ink text-[15px] font-medium text-paper"
            >
              Try mSport
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
