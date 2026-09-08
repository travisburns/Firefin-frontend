"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/types/api";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (product.targetPrice == null) {
    return <p className="empty">Pricing coming soon.</p>;
  }

  const price = product.targetPrice;

  function handleAdd() {
    addItem({
      key: product.slug,
      title: product.name,
      subtitle: product.type === "FireDrop" ? "Fire Drop" : product.type,
      unitPrice: price,
      qty: 1
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button className="btn" onClick={handleAdd}>
      {added ? "Added ✓" : `Add to cart — $${price.toFixed(2)}`}
    </button>
  );
}
