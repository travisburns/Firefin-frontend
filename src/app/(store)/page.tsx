import Link from "next/link";
import { api } from "@/lib/api";
import { sellable } from "@/lib/sellable";
import { StoreProductCard } from "@/components/store/StoreProductCard";
import { HeatScale } from "@/components/store/HeatScale";
import { HowItWorks } from "@/components/store/HowItWorks";
import type { Product } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featured: Product[];
  try {
    featured = sellable(await api.getProducts()).slice(0, 4);
  } catch {
    featured = [];
  }

  return (
    <>
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">Seafood + peppers + fire</p>
          <h1 className="hero-title">
            Set your freezer on <span className="spark">fire.</span>
          </h1>
          <p className="hero-sub">
            Fire-built spicy salmon, engineered to cook straight from frozen.
            Ready when you are.
          </p>
          <div className="hero-cta">
            <Link href="/shop" className="btn">
              Shop meals
            </Link>
            <Link href="/shop" className="btn ghost">
              Explore sauces
            </Link>
          </div>
        </div>
        <div
          className="home-hero-visual"
          style={{ backgroundImage: "url('/concept/hero-firefin.jpg')" }}
          role="img"
          aria-label="The Firefin — spicy salmon meal, cooked from frozen"
        />
      </section>

      {/* Featured meals */}
      <section className="band">
        <h2 className="band-title center">✦ Featured ✦</h2>
        {featured.length === 0 ? (
          <p className="empty" style={{ textAlign: "center" }}>
            Our first products are still being perfected in the kitchen. Check back soon.
          </p>
        ) : (
          <div className="card-grid">
            {featured.map((p) => (
              <StoreProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <HeatScale />
      <HowItWorks />

      {/* Bundle band */}
      <section className="band promo">
        <div className="promo-copy">
          <h2 className="band-title">Bundle Your Freezer</h2>
          <p className="hero-sub">
            More fire. More flavor. More savings. Build your box with meals and
            sauces and save more per meal.
          </p>
          <Link href="/build-your-freezer" className="btn">
            Build a box
          </Link>
        </div>
        <div
          className="promo-visual box"
          style={{ backgroundImage: "url('/concept/bundle-box.jpg')" }}
          role="img"
          aria-label="Firefin freezer bundle box"
        />
      </section>

      {/* Sauces band */}
      <section className="band promo reverse">
        <div className="promo-copy">
          <h2 className="band-title">Firefin Sauces</h2>
          <p className="hero-sub">Crafted to ignite. Built to elevate.</p>
          <Link href="/shop" className="btn ghost">
            Shop sauces
          </Link>
        </div>
        <div
          className="promo-visual sauces"
          style={{ backgroundImage: "url('/concept/sauces.jpg')" }}
          role="img"
          aria-label="Firefin sauces — Blue Flame, Green Fire, Black Ember"
        />
      </section>

      {/* Latest drop */}
      <section className="band drop">
        <div className="drop-inner">
          <div>
            <p className="eyebrow">Latest drop</p>
            <h2 className="band-title" style={{ margin: "4px 0 8px" }}>
              Blue Flame
            </h2>
            <p className="hero-sub" style={{ margin: 0 }}>
              Sweet meets spice. Blueberry, Fresno, garlic. Pure fire.
            </p>
          </div>
          <Link href="/shop" className="btn">
            See what&apos;s new
          </Link>
        </div>
      </section>
    </>
  );
}
