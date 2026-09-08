import Link from "next/link";
import type { Product } from "@/types/api";
import { HeatMeter } from "@/components/HeatMeter";
import { TypeBadge } from "@/components/StatusBadge";

export function StoreProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.slug}`} className="card product-card">
      <div className="product-thumb" aria-hidden />
      <h3>{product.name}</h3>
      {product.description && (
        <p className="page-subtitle" style={{ margin: "0 0 8px" }}>
          {product.description}
        </p>
      )}
      <div className="meta-row">
        <TypeBadge type={product.type} />
        <HeatMeter level={product.heatLevel} />
        {product.targetPrice != null && (
          <span className="price">${product.targetPrice.toFixed(2)}</span>
        )}
      </div>
    </Link>
  );
}
