import { api } from "@/lib/api";
import { sellable } from "@/lib/sellable";
import { FreezerBuilder } from "@/components/store/FreezerBuilder";
import type { Product } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function BuildYourFreezerPage() {
  let meals: Product[];
  try {
    meals = sellable(await api.getProducts()).filter((p) => p.type === "Meal");
  } catch {
    meals = [];
  }

  return (
    <>
      <h1 className="page-title">Build Your Freezer</h1>
      <p className="page-subtitle">
        Stock your freezer with meals you already know you&apos;ll eat. Pick a box
        size, mix and match, and save more per meal as the box grows.
      </p>
      <FreezerBuilder meals={meals} />
    </>
  );
}
