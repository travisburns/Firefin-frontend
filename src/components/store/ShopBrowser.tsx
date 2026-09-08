"use client";

import { useMemo, useState } from "react";
import type { Product, ProductType } from "@/types/api";
import { ProductTile } from "./ProductTile";

type TypeFilter = "All" | ProductType;
type HeatBucket = "No Heat" | "Mild" | "Medium" | "Hot" | "Fire";

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Meal", label: "Meals" },
  { value: "Sauce", label: "Sauces" },
  { value: "FireDrop", label: "Fire Drops" }
];

const HEAT_BUCKETS: HeatBucket[] = ["No Heat", "Mild", "Medium", "Hot", "Fire"];

function bucketOf(level: number | null): HeatBucket {
  if (level == null || level <= 0) return "No Heat";
  if (level === 1) return "Mild";
  if (level <= 3) return "Medium";
  if (level === 4) return "Hot";
  return "Fire";
}

export function ShopBrowser({ products }: { products: Product[] }) {
  const [type, setType] = useState<TypeFilter>("All");
  const [heats, setHeats] = useState<Set<HeatBucket>>(new Set());

  const heatCounts = useMemo(() => {
    const counts: Record<HeatBucket, number> = {
      "No Heat": 0,
      Mild: 0,
      Medium: 0,
      Hot: 0,
      Fire: 0
    };
    for (const p of products) counts[bucketOf(p.heatLevel)]++;
    return counts;
  }, [products]);

  const shown = useMemo(
    () =>
      products.filter((p) => {
        if (type !== "All" && p.type !== type) return false;
        if (heats.size > 0 && !heats.has(bucketOf(p.heatLevel))) return false;
        return true;
      }),
    [products, type, heats]
  );

  function toggleHeat(bucket: HeatBucket) {
    setHeats((prev) => {
      const next = new Set(prev);
      next.has(bucket) ? next.delete(bucket) : next.add(bucket);
      return next;
    });
  }

  function clearAll() {
    setType("All");
    setHeats(new Set());
  }

  return (
    <div className="shop-layout">
      <aside className="filters card">
        <div className="filters-head">
          <strong>Filters</strong>
          <button className="link-btn" onClick={clearAll}>
            Clear all
          </button>
        </div>

        <div className="filter-group">
          <span className="filter-label">Heat level</span>
          {HEAT_BUCKETS.map((bucket) => (
            <label key={bucket} className="check">
              <input
                type="checkbox"
                checked={heats.has(bucket)}
                onChange={() => toggleHeat(bucket)}
              />
              <span>{bucket}</span>
              <span className="count">{heatCounts[bucket]}</span>
            </label>
          ))}
        </div>

        <div className="filter-group">
          <span className="filter-label">Type</span>
          <div className="filter-row">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                className={`chip ${type === f.value ? "active" : ""}`}
                onClick={() => setType(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div>
        <p className="results-count">
          <strong>{shown.length}</strong> {shown.length === 1 ? "product" : "products"}
        </p>
        {shown.length === 0 ? (
          <p className="empty">
            Nothing matches yet. Products appear here once their recipe is locked.
          </p>
        ) : (
          <div className="card-grid tiles">
            {shown.map((p) => (
              <ProductTile key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
