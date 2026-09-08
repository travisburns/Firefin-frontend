import { api } from "@/lib/api";
import { sellable } from "@/lib/sellable";
import { ShopHero } from "@/components/store/ShopHero";
import { ProductTile } from "@/components/store/ProductTile";
import { BundleBand } from "@/components/store/BundleBand";
import { StoreFeatureRow } from "@/components/store/StoreFeatureRow";
import type { Product } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function SaucesPage() {
  let sauces: Product[] = [];
  try {
    sauces = sellable(await api.getProducts()).filter((p) => p.type === "Sauce");
  } catch {
    sauces = [];
  }

  return (
    <>
      <ShopHero
        title="Sauces"
        tagline="Bold flavor. No apologies."
        blurb="Crafted to ignite every bite — the perfect partner to Firefin meals, and everything else."
        image="/concept/sauces-hero.jpg"
      />

      <section className="band">
        <h2 className="band-title center">Choose your flavor</h2>
        {sauces.length === 0 ? (
          <p className="empty" style={{ textAlign: "center" }}>
            Our first sauce (Blue Flame) is still in development. Check back soon.
          </p>
        ) : (
          <div className="card-grid tiles">
            {sauces.map((s) => (
              <ProductTile key={s.id} product={s} />
            ))}
          </div>
        )}
      </section>

      <BundleBand />
      <StoreFeatureRow />
    </>
  );
}
