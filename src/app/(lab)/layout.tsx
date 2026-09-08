import Link from "next/link";

export default function LabLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link href="/lab" className="brand">
            FIRE<span className="spark">FIN</span> LAB
          </Link>
          <span className="tagline">Recipe &amp; batch R&amp;D · internal</span>
          <Link href="/" className="back-link" style={{ marginLeft: "auto" }}>
            View store →
          </Link>
        </div>
      </header>
      <main className="container">{children}</main>
    </>
  );
}
