"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import type { Product } from "@/types/api";

const BOX_SIZES = [6, 12, 20] as const;

// PLACEHOLDER bundle discounts. Per the blueprint, real percentages are set
// only once the 3.25x direct-COGS rule is preserved at the bundle level — so
// these live in one obvious place to be replaced by a backend pricing service.
const DISCOUNT_BY_SIZE: Record<number, number> = { 6: 0.05, 12: 0.1, 20: 0.15 };

interface Props {
  meals: Product[];
}

export function FreezerBuilder({ meals }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const priced = meals.filter((m) => m.targetPrice != null);

  const [boxSize, setBoxSize] = useState<number>(BOX_SIZES[0]);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [added, setAdded] = useState(false);

  const filled = useMemo(
    () => Object.values(picks).reduce((n, q) => n + q, 0),
    [picks]
  );
  const slotsLeft = boxSize - filled;

  const listPrice = useMemo(
    () =>
      priced.reduce((sum, m) => sum + (m.targetPrice ?? 0) * (picks[m.slug] ?? 0), 0),
    [priced, picks]
  );
  const discount = DISCOUNT_BY_SIZE[boxSize] ?? 0;
  const boxPrice = listPrice * (1 - discount);
  const savings = listPrice - boxPrice;
  const perMeal = filled > 0 ? boxPrice / filled : 0;

  function changeQty(slug: string, delta: number) {
    setPicks((prev) => {
      const next = (prev[slug] ?? 0) + delta;
      if (next <= 0) {
        const { [slug]: _removed, ...rest } = prev;
        return rest;
      }
      if (delta > 0 && slotsLeft <= 0) return prev;
      return { ...prev, [slug]: next };
    });
  }

  function changeBoxSize(size: number) {
    setBoxSize(size);
    setPicks((prev) => {
      // Trim selections that no longer fit the smaller box.
      let budget = size;
      const trimmed: Record<string, number> = {};
      for (const [slug, qty] of Object.entries(prev)) {
        if (budget <= 0) break;
        const take = Math.min(qty, budget);
        trimmed[slug] = take;
        budget -= take;
      }
      return trimmed;
    });
  }

  function addBox() {
    const contents = priced
      .filter((m) => picks[m.slug])
      .map((m) => `${picks[m.slug]}× ${m.name}`)
      .join(", ");
    addItem({
      key: `freezer-box-${boxSize}-${Date.now()}`,
      title: `Build Your Freezer — ${boxSize} meals`,
      subtitle: contents,
      unitPrice: Number(boxPrice.toFixed(2)),
      qty: 1
    });
    setPicks({});
    setAdded(true);
    router.refresh();
    window.setTimeout(() => setAdded(false), 1800);
  }

  if (priced.length === 0) {
    return (
      <p className="empty">
        No meals are available to build a box yet. Meals appear here once their
        recipe is locked and priced.
      </p>
    );
  }

  return (
    <div className="freezer">
      <div className="box-sizes">
        {BOX_SIZES.map((size) => (
          <button
            key={size}
            className={`chip ${boxSize === size ? "active" : ""}`}
            onClick={() => changeBoxSize(size)}
          >
            {size} meals
          </button>
        ))}
      </div>

      <div className="card-grid">
        {priced.map((m) => (
          <div key={m.id} className="card">
            <h3 style={{ margin: "0 0 4px" }}>{m.name}</h3>
            <span className="price">${m.targetPrice!.toFixed(2)}</span>
            <div className="qty-controls">
              <button className="btn ghost" onClick={() => changeQty(m.slug, -1)} disabled={!picks[m.slug]}>
                −
              </button>
              <span className="qty">{picks[m.slug] ?? 0}</span>
              <button className="btn ghost" onClick={() => changeQty(m.slug, 1)} disabled={slotsLeft <= 0}>
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card freezer-summary">
        <div className="summary-row">
          <span>Slots</span>
          <strong>
            {filled} / {boxSize} {slotsLeft > 0 ? `(${slotsLeft} left)` : "(full)"}
          </strong>
        </div>
        <div className="summary-row">
          <span>List price</span>
          <span>${listPrice.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Bundle savings ({Math.round(discount * 100)}%)</span>
          <span className="save">−${savings.toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Box price</span>
          <strong>${boxPrice.toFixed(2)}</strong>
        </div>
        {filled > 0 && (
          <div className="summary-row">
            <span>Per meal</span>
            <span>${perMeal.toFixed(2)}</span>
          </div>
        )}
        <button className="btn" onClick={addBox} disabled={filled !== boxSize}>
          {added ? "Added ✓" : filled === boxSize ? "Add box to cart" : `Fill ${slotsLeft} more`}
        </button>
        <p className="fineprint">
          Bundle discounts are placeholders until unit economics (3.25× direct
          COGS) are validated at the bundle level.
        </p>
      </div>
    </div>
  );
}
