import { api } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

// Internal tool — always render fresh.
export const dynamic = "force-dynamic";

export default async function LabPage() {
  let products;
  try {
    products = await api.getProducts();
  } catch {
    return (
      <>
        <h1 className="page-title">Recipe &amp; Batch Lab</h1>
        <p className="error">
          Could not reach the Firefin API. Start the backend (<code>dotnet run --project Firefin.Api</code>)
          and confirm <code>NEXT_PUBLIC_API_BASE_URL</code> points at it.
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="page-title">Recipe &amp; Batch Lab</h1>
      <p className="page-subtitle">
        Every product in development. Open one to see its formula versions and batch history.
      </p>

      {products.length === 0 ? (
        <p className="empty">No products yet.</p>
      ) : (
        <div className="card-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
