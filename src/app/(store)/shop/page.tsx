import { api } from "@/lib/api";
import { sellable } from "@/lib/sellable";
import { ShopHero } from "@/components/store/ShopHero";
import { ShopBrowser } from "@/components/store/ShopBrowser";
import { BundleBand } from "@/components/store/BundleBand";
import { StoreFeatureRow } from "@/components/store/StoreFeatureRow";
import type { Product } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  let products: Product[];
  try {
    products = sellable(await api.getProducts());
  } catch {
    return (
      <>
        <h1 className="page-title">Shop</h1>
        <p className="error">Could not load products. Please try again shortly.</p>
      </>
    );
  }

  return (
    <>
      <ShopHero
        title="Shop Meals"
        tagline="Bold flavor. Zero compromise."
        blurb="Premium salmon, signature glazes, serious heat — everything you need is already on it."
        image="/concept/shop-hero.jpg"
      />
      <ShopBrowser products={products} />
      <BundleBand />
      <StoreFeatureRow />
    </>
  );
}
