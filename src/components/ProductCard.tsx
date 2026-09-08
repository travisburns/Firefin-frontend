import Link from "next/link";
import type { Product } from "@/types/api";
import { HeatMeter } from "./HeatMeter";
import { StatusBadge, TypeBadge } from "./StatusBadge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/lab/${product.slug}`} className="card product-card">
      <h3>{product.name}</h3>
      {product.description && <p className="page-subtitle">{product.description}</p>}
      <div className="meta-row">
        <TypeBadge type={product.type} />
        <StatusBadge status={product.status} />
        <HeatMeter level={product.heatLevel} />
      </div>
      <div className="meta-row">
        <span className="badge muted">
          {product.recipeCount} recipe{product.recipeCount === 1 ? "" : "s"}
        </span>
      </div>
    </Link>
  );
}
