import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/queryClient";
import Link from "next/link";

export const metadata: Metadata = {
  title: "StadtHelfer — Find local services and events",
  description:
    "Discover local services, events, rentals, and community activities near you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <QueryProvider>
          <header className="border-b bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-xl font-bold text-blue-600">
                StadtHelfer
              </Link>

              <nav className="flex items-center gap-4 text-sm font-medium">
                <Link href="/" className="hover:text-blue-600">
                  Explore
                </Link>
                <Link href="/create-listing" className="hover:text-blue-600">
                  Add listing
                </Link>
                <Link href="/login" className="hover:text-blue-600">
                  Login
                </Link>
                <Link href="/register" className="hover:text-blue-600">
                  Register
                </Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
