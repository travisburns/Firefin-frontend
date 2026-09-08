import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { isSellable } from "@/lib/sellable";
import { HeatMeter } from "@/components/HeatMeter";
import { TypeBadge } from "@/components/StatusBadge";
import { AddToCartButton } from "@/components/store/AddToCartButton";

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

  // Don't expose products that aren't ready to sell.
  if (!isSellable(product)) notFound();

  return (
    <>
      <Link href="/shop" className="back-link">
        ← Shop
      </Link>

      <div className="product-detail">
        <div className="product-hero" aria-hidden />
        <div>
          <h1 className="page-title" style={{ marginTop: 0 }}>
            {product.name}
          </h1>
          <div className="meta-row">
            <TypeBadge type={product.type} />
            <HeatMeter level={product.heatLevel} />
          </div>
          {product.description && <p style={{ marginTop: 16 }}>{product.description}</p>}
          {product.targetPrice != null && (
            <p className="price price-lg">${product.targetPrice.toFixed(2)}</p>
          )}
          <div style={{ marginTop: 16 }}>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </>
  );
}
