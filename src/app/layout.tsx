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
          <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-2xl font-black text-white no-underline hover:no-underline tracking-tight">
              🍕 <span style={{ color: '#FFD700' }}>Foldable</span>
            </Link>
            <div className="flex gap-6 text-sm font-semibold">
              <Link href="/shops" style={{ color: '#FFD700' }} className="hover:text-yellow-100 no-underline">Shops</Link>
              <Link href="/about" style={{ color: '#FFD700' }} className="hover:text-yellow-100 no-underline">About</Link>
              <Link href="/admin/login" style={{ color: '#FFD700' }} className="hover:text-yellow-100 no-underline">Admin</Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-warm-border text-center py-6 text-sm text-warm-muted">
          Foldable — Pizza Rating App
        </footer>
      </body>
    </html>
  );
}
