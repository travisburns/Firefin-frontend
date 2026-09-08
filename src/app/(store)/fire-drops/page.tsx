import { api } from "@/lib/api";
import { sellable } from "@/lib/sellable";
import { ShopHero } from "@/components/store/ShopHero";
import { ProductTile } from "@/components/store/ProductTile";
import type { Product } from "@/types/api";

export const dynamic = "force-dynamic";

const WHY = [
  { icon: "🔥", title: "Limited batches", copy: "It's gone when it's gone." },
  { icon: "🧪", title: "Experimental flavors", copy: "Bold ideas. Real ingredients." },
  { icon: "🌱", title: "Seasonal & rare", copy: "Taste the now." },
  { icon: "📦", title: "Fans shape what's next", copy: "Favorites can go permanent." }
];

export default async function FireDropsPage() {
  let drops: Product[] = [];
  try {
    drops = sellable(await api.getProducts()).filter((p) => p.type === "FireDrop");
  } catch {
    drops = [];
  }

  return (
    <>
      <ShopHero
        title="Fire Drops"
        tagline="Where heat meets obsession."
        blurb="Limited batches. Real ingredients. Never made twice. Rare flavors and experimental recipes — once it's gone, it's gone."
        image="/concept/firedrops-hero.jpg"
      />

      <section className="band">
        <h2 className="band-title center">Current &amp; upcoming drops</h2>
        {drops.length === 0 ? (
          <p className="empty" style={{ textAlign: "center" }}>
            No live drops right now. New drops appear here the moment they go live.
          </p>
        ) : (
          <div className="card-grid tiles">
            {drops.map((d) => (
              <ProductTile key={d.id} product={d} />
            ))}
          </div>
        )}
      </section>

      <section className="feature-row">
        {WHY.map((w) => (
          <div key={w.title} className="feature">
            <span className="feature-icon" aria-hidden>{w.icon}</span>
            <div>
              <strong>{w.title}</strong>
              <p className="page-subtitle" style={{ margin: 0 }}>{w.copy}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
