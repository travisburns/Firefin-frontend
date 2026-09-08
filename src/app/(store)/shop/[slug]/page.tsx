import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { isSellable, sellable } from "@/lib/sellable";
import { HeatMeter } from "@/components/HeatMeter";
import { ProductPurchasePanel } from "@/components/store/ProductPurchasePanel";
import { ProductTabs } from "@/components/store/ProductTabs";
import { StoreFeatureRow } from "@/components/store/StoreFeatureRow";
import type { Product } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function StoreProductPage({
  params
}: {
  params: { slug: string };
}) {
  const product = await api.getProductBySlug(params.slug).catch((err) => {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  });

  if (!isSellable(product)) notFound();

  // "Perfect with" sauces (exclude the current product).
  let sauces: Product[] = [];
  try {
    sauces = sellable(await api.getProducts())
      .filter((p) => p.type === "Sauce" && p.id !== product.id)
      .slice(0, 3);
  } catch {
    sauces = [];
  }

  return (
    <>
      <nav className="breadcrumb">
        <Link href="/">Home</Link> <span>/</span>{" "}
        <Link href="/shop">Shop</Link> <span>/</span> <span>{product.name}</span>
      </nav>

      <div className="pdp">
        <div
          className="pdp-media"
          style={{ backgroundImage: "url('/concept/product-hero.jpg')" }}
          role="img"
          aria-label={product.name}
        />
        <div className="pdp-info">
          <h1 className="pdp-title">{product.name}</h1>
          <div className="meta-row">
            <span className="badge">{product.type === "FireDrop" ? "Fire Drop" : product.type}</span>
            <span className="pdp-spec">
              Heat <HeatMeter level={product.heatLevel} />
            </span>
            <span className="badge">❄️ Cook from frozen</span>
          </div>
          <ProductPurchasePanel product={product} />
          <Link href="/build-your-freezer" className="pdp-bundle">
            <strong>Build Your Freezer & save more</strong>
            <span>Mix &amp; match any meals and sauces →</span>
          </Link>
        </div>
      </div>

      <ProductTabs description={product.description} />

      {sauces.length > 0 && (
        <section className="band">
          <h2 className="band-title">Perfect with Firefin sauces</h2>
          <div className="card-grid tiles">
            {sauces.map((s) => (
              <Link key={s.id} href={`/shop/${s.slug}`} className="card product-tile">
                <div className="product-thumb" aria-hidden />
                <h3 style={{ margin: 0, fontSize: 16 }}>{s.name}</h3>
                {s.targetPrice != null && (
                  <span className="price">${s.targetPrice.toFixed(2)}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <StoreFeatureRow />
    </>
  );
}
