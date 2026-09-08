import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Firefin",
  description: "Spicy seafood, engineered for your freezer. Seafood + peppers + fire."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
