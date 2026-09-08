"use client";

import { useState } from "react";
import type { Product, ProductType } from "@/types/api";
import { StoreProductCard } from "./StoreProductCard";

type Filter = "All" | ProductType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Meal", label: "Meals" },
  { value: "Sauce", label: "Sauces" },
  { value: "FireDrop", label: "Fire Drops" }
];

export function ShopGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const shown = filter === "All" ? products : products.filter((p) => p.type === filter);

  return (
    <>
      <div className="filter-row">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`chip ${filter === f.value ? "active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="empty">Nothing here yet — check back soon.</p>
      ) : (
        <div className="card-grid">
          {shown.map((p) => (
            <StoreProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
