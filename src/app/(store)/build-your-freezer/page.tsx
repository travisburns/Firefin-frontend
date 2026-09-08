import { api } from "@/lib/api";
import { sellable } from "@/lib/sellable";
import { ShopHero } from "@/components/store/ShopHero";
import { FreezerBuilder } from "@/components/store/FreezerBuilder";
import { StoreFeatureRow } from "@/components/store/StoreFeatureRow";
import type { Product } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function BuildYourFreezerPage() {
  let meals: Product[] = [];
  let sauces: Product[] = [];
  try {
    const all = sellable(await api.getProducts());
    meals = all.filter((p) => p.type === "Meal");
    sauces = all.filter((p) => p.type === "Sauce");
  } catch {
    meals = [];
    sauces = [];
  }

  return (
    <>
      <ShopHero
        title="Build Your Freezer"
        tagline="Pick a box. Fill it with fire."
        blurb="Mix, match, and load up on your favorites. The more you pack, the more you save."
        image="/concept/bundle-box.jpg"
      />
      <FreezerBuilder meals={meals} sauces={sauces} />
      <StoreFeatureRow />
    </>
  );
}
