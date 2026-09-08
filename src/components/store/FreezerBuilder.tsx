"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { HeatMeter } from "@/components/HeatMeter";
import type { Product } from "@/types/api";

const BOX_SIZES = [6, 12, 20] as const;

// PLACEHOLDER bundle discounts, mirroring the concept's tiers. Real percentages
// wait on the 3.25x direct-COGS rule being preserved at the bundle level.
const DISCOUNT_BY_SIZE: Record<number, number> = { 6: 0.15, 12: 0.2, 20: 0.3 };

type HeatFilter = "All" | "Mild" | "Medium" | "Hot" | "Fire";
const HEAT_FILTERS: HeatFilter[] = ["All", "Mild", "Medium", "Hot", "Fire"];

function matchesHeat(level: number | null, filter: HeatFilter): boolean {
  if (filter === "All") return true;
  const l = level ?? 0;
  if (filter === "Mild") return l === 1;
  if (filter === "Medium") return l === 2 || l === 3;
  if (filter === "Hot") return l === 4;
  return l >= 5;
}

export function FreezerBuilder({
  meals,
  sauces
}: {
  meals: Product[];
  sauces: Product[];
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const pricedMeals = meals.filter((m) => m.targetPrice != null);
  const pricedSauces = sauces.filter((s) => s.targetPrice != null);
  const refPrice = pricedMeals.length
    ? Math.min(...pricedMeals.map((m) => m.targetPrice!))
    : 14.99;

  const [boxSize, setBoxSize] = useState<number>(BOX_SIZES[0]);
  const [heat, setHeat] = useState<HeatFilter>("All");
  const [mealPicks, setMealPicks] = useState<Record<string, number>>({});
  const [saucePicks, setSaucePicks] = useState<Record<string, number>>({});
  const [added, setAdded] = useState(false);

  const filled = useMemo(
    () => Object.values(mealPicks).reduce((n, q) => n + q, 0),
    [mealPicks]
  );
  const slotsLeft = boxSize - filled;
  const discount = DISCOUNT_BY_SIZE[boxSize] ?? 0;

  const mealsList = pricedMeals.reduce(
    (sum, m) => sum + m.targetPrice! * (mealPicks[m.slug] ?? 0),
    0
  );
  const boxDiscount = mealsList * discount;
  const saucesTotal = pricedSauces.reduce(
    (sum, s) => sum + s.targetPrice! * (saucePicks[s.slug] ?? 0),
    0
  );
  const total = mealsList - boxDiscount + saucesTotal;

  const shownMeals = pricedMeals.filter((m) => matchesHeat(m.heatLevel, heat));

  function changeMeal(slug: string, delta: number) {
    setMealPicks((prev) => {
      const next = (prev[slug] ?? 0) + delta;
      if (next <= 0) {
        const { [slug]: _drop, ...rest } = prev;
        return rest;
      }
      if (delta > 0 && slotsLeft <= 0) return prev;
      return { ...prev, [slug]: next };
    });
  }

  function changeSauce(slug: string, delta: number) {
    setSaucePicks((prev) => {
      const next = (prev[slug] ?? 0) + delta;
      if (next <= 0) {
        const { [slug]: _drop, ...rest } = prev;
        return rest;
      }
      return { ...prev, [slug]: next };
    });
  }

  function changeBoxSize(size: number) {
    setBoxSize(size);
    setMealPicks((prev) => {
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
    const mealContents = pricedMeals
      .filter((m) => mealPicks[m.slug])
      .map((m) => `${mealPicks[m.slug]}× ${m.name}`);
    const sauceContents = pricedSauces
      .filter((s) => saucePicks[s.slug])
      .map((s) => `${saucePicks[s.slug]}× ${s.name}`);
    addItem({
      key: `freezer-box-${boxSize}-${Date.now()}`,
      title: `Build Your Freezer — ${boxSize} meals`,
      subtitle: [...mealContents, ...sauceContents].join(", "),
      unitPrice: Number(total.toFixed(2)),
      qty: 1
    });
    setMealPicks({});
    setSaucePicks({});
    setAdded(true);
    router.refresh();
    window.setTimeout(() => setAdded(false), 1800);
  }

  if (pricedMeals.length === 0) {
    return (
      <p className="empty">
        No meals are available to build a box yet. Meals appear here once their
        recipe is locked and priced.
      </p>
    );
  }

  return (
    <div className="byf-layout">
      {/* Builder */}
      <div>
        <div className="step-label">
          <span className="step-dot">1</span> Choose your box size
        </div>
        <div className="box-size-cards">
          {BOX_SIZES.map((size) => {
            const d = DISCOUNT_BY_SIZE[size] ?? 0;
            const perMeal = refPrice * (1 - d);
            return (
              <button
                key={size}
                className={`box-card ${boxSize === size ? "active" : ""}`}
                onClick={() => changeBoxSize(size)}
              >
                {size === 6 && <span className="box-flag">Most popular</span>}
                <strong className="box-n">{size} meals</strong>
                <span className="box-per">from ${perMeal.toFixed(2)} / meal</span>
                <span className="pack-save">Save {Math.round(d * 100)}%</span>
              </button>
            );
          })}
        </div>

        <div className="step-label">
          <span className="step-dot">2</span> Fill your box
          <span className="slots-note">
            {slotsLeft > 0 ? `${slotsLeft} of ${boxSize} slots left` : "Box full"}
          </span>
        </div>

        <div className="slot-track">
          {Array.from({ length: boxSize }).map((_, i) => (
            <span key={i} className={`slot ${i < filled ? "on" : ""}`}>
              {i < filled ? "✓" : i + 1}
            </span>
          ))}
        </div>

        <div className="filter-row">
          {HEAT_FILTERS.map((f) => (
            <button
              key={f}
              className={`chip ${heat === f ? "active" : ""}`}
              onClick={() => setHeat(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="card-grid tiles">
          {shownMeals.map((m) => {
            const qty = mealPicks[m.slug] ?? 0;
            return (
              <div key={m.id} className={`card product-tile ${qty ? "in-box" : ""}`}>
                <div className="product-thumb" aria-hidden />
                <h3 style={{ margin: 0, fontSize: 16 }}>{m.name}</h3>
                {m.description && <p className="tile-desc">{m.description}</p>}
                <div className="meta-row">
                  <HeatMeter level={m.heatLevel} />
                  <span className="price">${m.targetPrice!.toFixed(2)}</span>
                </div>
                {qty ? (
                  <div className="qty-controls">
                    <button className="btn ghost" onClick={() => changeMeal(m.slug, -1)}>−</button>
                    <span className="qty">{qty}</span>
                    <button className="btn ghost" onClick={() => changeMeal(m.slug, 1)} disabled={slotsLeft <= 0}>+</button>
                  </div>
                ) : (
                  <button className="btn ghost" onClick={() => changeMeal(m.slug, 1)} disabled={slotsLeft <= 0}>
                    Add to box
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Your box summary */}
      <aside className="byf-summary card">
        <div className="filters-head">
          <strong>Your box ({filled} of {boxSize})</strong>
        </div>

        {filled === 0 ? (
          <p className="empty">Add meals to start your box.</p>
        ) : (
          pricedMeals
            .filter((m) => mealPicks[m.slug])
            .map((m) => (
              <div key={m.id} className="box-line">
                <span>{mealPicks[m.slug]}× {m.name}</span>
                <button className="link-btn" onClick={() => changeMeal(m.slug, -mealPicks[m.slug])}>✕</button>
              </div>
            ))
        )}

        {pricedSauces.length > 0 && (
          <>
            <div className="filter-label" style={{ marginTop: 14 }}>Add fire (optional)</div>
            {pricedSauces.map((s) => (
              <div key={s.id} className="box-line">
                <span>{s.name} · ${s.targetPrice!.toFixed(2)}</span>
                <div className="qty-controls" style={{ margin: 0 }}>
                  <button className="link-btn" onClick={() => changeSauce(s.slug, -1)} disabled={!saucePicks[s.slug]}>−</button>
                  <span className="qty">{saucePicks[s.slug] ?? 0}</span>
                  <button className="link-btn" onClick={() => changeSauce(s.slug, 1)}>+</button>
                </div>
              </div>
            ))}
          </>
        )}

        <div className="summary-divider" />
        <div className="summary-row"><span>Meals ({filled})</span><span>${mealsList.toFixed(2)}</span></div>
        <div className="summary-row"><span>Box discount ({Math.round(discount * 100)}%)</span><span className="save">−${boxDiscount.toFixed(2)}</span></div>
        {saucesTotal > 0 && <div className="summary-row"><span>Sauces</span><span>${saucesTotal.toFixed(2)}</span></div>}
        <div className="summary-row total"><span>Estimated total</span><strong>${total.toFixed(2)}</strong></div>

        <button className="btn add-freezer" onClick={addBox} disabled={filled !== boxSize}>
          {added ? "Added ✓" : filled === boxSize ? "Add box to cart" : `Fill ${slotsLeft} more`}
        </button>
        <p className="fineprint">
          Bundle discounts are placeholders until unit economics (3.25× direct
          COGS) are validated at the bundle level.
        </p>
      </aside>
    </div>
  );
}
