"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ACCENT = "#b91c1c";

const tabs = [
  {
    href: "/",
    label: "Home",
    icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
  },
  {
    href: "/slices",
    label: "Slices",
    icon: <><path d="M12 2 2 20h20z" /><circle cx="10" cy="14" r="1" /><circle cx="14" cy="16" r="1" /><circle cx="12" cy="10" r="1" /></>,
  },
  {
    href: "/shops",
    label: "Shops",
    icon: <><path d="M3 3h18v4H3z" /><path d="M3 7v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7" /><path d="M8 7v4a4 4 0 0 0 8 0V7" /></>,
  },
  {
    href: "/about",
    label: "About",
    icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>,
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  // Treat /visits/* as part of Slices, and /shops/* as part of Shops
  if (href === "/slices") return pathname.startsWith("/slices") || pathname.startsWith("/visits");
  return pathname.startsWith(href);
}

export function BottomNav() {
  const pathname = usePathname() || "/";

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md border border-warm-border rounded-full shadow-lg px-3 py-2 flex items-center gap-1">
      {tabs.map((t) => {
        const active = isActive(pathname, t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-full no-underline hover:no-underline transition-colors ${
              active ? "bg-accent shadow-sm" : "hover:bg-red-50"
            }`}
            // Inline color: the global `a { color }` rule overrides Tailwind text utilities
            style={{ color: active ? "#ffffff" : ACCENT }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {t.icon}
            </svg>
            <span className="text-xs font-semibold">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
