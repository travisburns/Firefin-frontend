import Link from "next/link";
import { api } from "@/lib/api";
import { sellable } from "@/lib/sellable";
import { StoreProductCard } from "@/components/store/StoreProductCard";
import type { Product } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featured: Product[];
  try {
    featured = sellable(await api.getProducts()).slice(0, 3);
  } catch {
    featured = [];
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Seafood + peppers + fire</p>
        <h1 className="hero-title">Set your freezer on fire.</h1>
        <p className="hero-sub">
          Premium spicy seafood, engineered to cook straight from frozen. Pull it
          out, cook it, and ask yourself: that came out of my freezer?
        </p>
        <div className="hero-cta">
          <Link href="/build-your-freezer" className="btn">
            Build your freezer
          </Link>
          <Link href="/shop" className="btn ghost">
            Shop meals &amp; sauces
          </Link>
        </div>
      </section>

      <div className="section-title">Featured</div>
      {featured.length === 0 ? (
        <p className="empty">
          Our first products are still being perfected in the kitchen. Check back soon.
        </p>
      ) : (
        <div className="card-grid">
          {featured.map((p) => (
            <StoreProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
