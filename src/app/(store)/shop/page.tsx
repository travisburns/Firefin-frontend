import { api } from "@/lib/api";
import { sellable } from "@/lib/sellable";
import { ShopGrid } from "@/components/store/ShopGrid";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  let products;
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
      <h1 className="page-title">Shop</h1>
      <p className="page-subtitle">Meals, sauces, and Fire Drops — cook from frozen.</p>
      <ShopGrid products={products} />
    </>
  );
}
