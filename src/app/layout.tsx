import type { Metadata } from "next";
import Link from "next/link";
import { Lilita_One } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

// Chunky pizzeria-sign font for headings and the logo (body text stays system font)
const displayFont = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lilita",
});

export const metadata: Metadata = {
  title: "Foldable — Pizza Ratings",
  description: "A personal pizza review app for tracking and rating slices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${displayFont.variable}`}>
      <body className="min-h-full flex flex-col">
        <header className="bg-accent text-white sticky top-0 z-50 shadow-md" style={{ borderRadius: '0 0 10px 10px' }}>
          <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 text-3xl text-white no-underline hover:no-underline shrink-0 font-display">
              🍕 <span style={{ color: '#FFD700' }}>Foldable</span>
            </Link>
            {/* On phones, Slices/Shops/About live in the bottom bar, so only Admin shows up here */}
            <div className="flex gap-6 text-sm font-semibold">
              <Link href="/slices" style={{ color: '#FFD700' }} className="hidden sm:inline hover:text-yellow-100 no-underline">Slices</Link>
              <Link href="/shops" style={{ color: '#FFD700' }} className="hidden sm:inline hover:text-yellow-100 no-underline">Shops</Link>
              <Link href="/about" style={{ color: '#FFD700' }} className="hidden sm:inline hover:text-yellow-100 no-underline">About</Link>
              <Link href="/admin/login" style={{ color: '#FFD700' }} className="hover:text-yellow-100 no-underline">Admin</Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 pb-8">{children}</main>

        <BottomNav />

        {/* Extra bottom padding so the floating bottom bar never covers the footer */}
        <footer className="border-t border-warm-border bg-white/70 text-center pt-8 pb-28 px-4">
          <p className="font-display text-2xl text-accent">🍕 Foldable</p>
          <p className="text-sm text-warm-muted mt-1">One slice at a time. Honest ratings from every shop I visit.</p>
          <nav className="flex justify-center gap-5 mt-4 text-sm font-semibold">
            <Link href="/" className="no-underline">Home</Link>
            <Link href="/slices" className="no-underline">Slices</Link>
            <Link href="/shops" className="no-underline">Shops</Link>
            <Link href="/about" className="no-underline">About</Link>
          </nav>
          <p className="text-xs text-warm-muted mt-4">© {new Date().getFullYear()} Foldable</p>
        </footer>
      </body>
    </html>
  );
}
