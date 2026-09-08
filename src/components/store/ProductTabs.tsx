"use client";

import { useState } from "react";

const TABS = ["Overview", "Cooking", "Nutrition"] as const;
type Tab = (typeof TABS)[number];

export function ProductTabs({ description }: { description: string | null }) {
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <section className="band">
      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="tab-body two-col">
          <div>
            <h3 className="tab-h">Bold. Spicy. Unforgettable.</h3>
            <p>{description ?? "A premium spicy-seafood meal, built to cook from frozen."}</p>
          </div>
          <ul className="checklist">
            <li>Loaded with real ingredients</li>
            <li>Big flavor, real heat</li>
            <li>No prep — cook from frozen</li>
            <li>High in protein, no fillers</li>
          </ul>
        </div>
      )}

      {tab === "Cooking" && (
        <div className="tab-body">
          <h3 className="tab-h">Cook from frozen</h3>
          <p className="page-subtitle">
            Oven and air fryer first; grill where it can be made reliable. Exact
            times and safe internal temperature are finalized after product testing.
          </p>
          <ul className="checklist">
            <li>Oven (recommended): bake from frozen on a lined sheet.</li>
            <li>Air fryer: cook from frozen until heated through.</li>
            <li>Always cook to the validated safe internal temperature.</li>
          </ul>
        </div>
      )}

      {tab === "Nutrition" && (
        <div className="tab-body">
          <h3 className="tab-h">Nutrition</h3>
          <p className="empty">
            The verified nutrition panel publishes once the recipe is locked and
            the label is generated — no placeholder numbers here.
          </p>
        </div>
      )}
    </section>
  );
}
