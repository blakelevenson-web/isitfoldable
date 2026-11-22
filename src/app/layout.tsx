import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header className="bg-accent text-white sticky top-0 z-50 shadow-md" style={{ borderRadius: '0 0 10px 10px' }}>
          <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-black text-white no-underline hover:no-underline tracking-tight shrink-0">
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
        <main className="flex-1 pb-24">{children}</main>

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md border border-warm-border rounded-full shadow-lg px-6 py-3 flex items-center gap-6">
          <Link href="/" className="flex flex-col items-center gap-1 no-underline text-warm-muted hover:text-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link href="/slices" className="flex flex-col items-center gap-1 no-underline text-warm-muted hover:text-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 20h20z"/><circle cx="10" cy="14" r="1"/><circle cx="14" cy="16" r="1"/><circle cx="12" cy="10" r="1"/></svg>
            <span className="text-xs font-medium">Slices</span>
          </Link>
          <Link href="/shops" className="flex flex-col items-center gap-1 no-underline text-warm-muted hover:text-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v4H3z"/><path d="M3 7v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7"/><path d="M8 7v4a4 4 0 0 0 8 0V7"/></svg>
            <span className="text-xs font-medium">Shops</span>
          </Link>
          <Link href="/about" className="flex flex-col items-center gap-1 no-underline text-warm-muted hover:text-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span className="text-xs font-medium">About</span>
          </Link>
        </nav>

        <footer className="border-t border-warm-border text-center py-6 text-sm text-warm-muted">
          Foldable — Pizza Rating App
        </footer>
      </body>
    </html>
  );
}
