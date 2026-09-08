"use client";

import Link from "next/link";
import type { Product } from "@/types/api";
import { HeatMeter } from "@/components/HeatMeter";
import { AddToCartButton } from "./AddToCartButton";

export function ProductTile({ product }: { product: Product }) {
  return (
    <div className="card product-tile">
      <Link href={`/shop/${product.slug}`} className="tile-media">
        <div className="product-thumb" aria-hidden />
        {product.type === "FireDrop" && <span className="tile-badge">Limited</span>}
      </Link>
      <Link href={`/shop/${product.slug}`} className="tile-name">
        <h3>{product.name}</h3>
      </Link>
      {product.description && <p className="tile-desc">{product.description}</p>}
      <div className="meta-row">
        <HeatMeter level={product.heatLevel} />
        {product.targetPrice != null && (
          <span className="price">${product.targetPrice.toFixed(2)}</span>
        )}
      </div>
      <AddToCartButton product={product} />
    </div>
  );
}
