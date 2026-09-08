import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Firefin Lab",
  description: "Internal R&D tool for perfecting Firefin recipes."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/lab" className="brand">
              FIRE<span className="spark">FIN</span> LAB
            </Link>
            <span className="tagline">Recipe &amp; batch R&amp;D</span>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
