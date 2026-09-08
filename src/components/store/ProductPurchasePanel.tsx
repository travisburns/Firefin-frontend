"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/types/api";

// Placeholder pack discounts — same doctrine as the freezer builder: real
// percentages wait on the 3.25x COGS rule. Multi-packs are sent to the cart as
// standalone lines (no product slug) so the discount survives checkout.
const PACKS = [
  { key: "single", label: "Single", units: 1, discount: 0, note: "1 meal" },
  { key: "double", label: "2-Pack", units: 2, discount: 0.07, note: "Save 7%" },
  { key: "six", label: "6-Pack", units: 6, discount: 0.15, note: "Save 15%" }
] as const;

type PackKey = (typeof PACKS)[number]["key"];

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [pack, setPack] = useState<PackKey>("single");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (product.targetPrice == null) {
    return <p className="empty">Pricing coming soon.</p>;
  }
  const unit = product.targetPrice;
  const selected = PACKS.find((p) => p.key === pack)!;
  const packPrice = unit * selected.units * (1 - selected.discount);

  function add() {
    if (selected.units === 1) {
      addItem({
        key: product.slug,
        title: product.name,
        subtitle: product.type === "FireDrop" ? "Fire Drop" : product.type,
        unitPrice: unit,
        qty
      });
    } else {
      addItem({
        key: `${product.slug}-${selected.units}pack`,
        title: `${product.name} (${selected.units}-pack)`,
        subtitle: `${selected.units} meals`,
        unitPrice: Number(packPrice.toFixed(2)),
        qty
      });
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="purchase">
      <div className="price-block">
        <span className="price price-lg">${unit.toFixed(2)}</span>
        <span className="portion">5–6 oz portion · 1 serving</span>
      </div>

      <div className="qty-controls">
        <span className="filter-label" style={{ margin: 0 }}>Quantity</span>
        <button className="btn ghost" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
        <span className="qty">{qty}</span>
        <button className="btn ghost" onClick={() => setQty((q) => q + 1)}>+</button>
      </div>

      <button className="btn add-freezer" onClick={add}>
        {added ? "Added ✓" : `Add to freezer — $${(packPrice * qty).toFixed(2)}`}
      </button>

      <div className="filter-label" style={{ marginTop: 4 }}>Buy more. Save more.</div>
      <div className="pack-row">
        {PACKS.map((p) => (
          <button
            key={p.key}
            className={`pack ${pack === p.key ? "active" : ""}`}
            onClick={() => setPack(p.key)}
          >
            <strong>{p.label}</strong>
            <span className={p.discount > 0 ? "pack-save" : "pack-note"}>{p.note}</span>
            <span className="pack-price">
              ${(unit * p.units * (1 - p.discount)).toFixed(2)}
            </span>
          </button>
        ))}
      </div>
      <p className="fineprint">
        Pack discounts are placeholders until unit economics (3.25× direct COGS)
        are validated.
      </p>
    </div>
  );
}
