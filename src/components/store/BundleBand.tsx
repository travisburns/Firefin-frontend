import Link from "next/link";

export function BundleBand() {
  return (
    <section className="band promo">
      <div className="promo-copy">
        <h2 className="band-title">More meals. More fire. More savings.</h2>
        <p className="hero-sub">
          Build a box of 6, 12, or 20 meals and save more per meal.
        </p>
        <Link href="/build-your-freezer" className="btn">
          Build your freezer
        </Link>
      </div>
      <div
        className="promo-visual box"
        style={{ backgroundImage: "url('/concept/bundle-box.jpg')" }}
        role="img"
        aria-label="Firefin freezer bundle box"
      />
    </section>
  );
}
