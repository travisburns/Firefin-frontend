import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { AddBatchForm } from "@/components/AddBatchForm";
import { BatchList } from "@/components/BatchList";
import { HeatMeter } from "@/components/HeatMeter";
import { IngredientTable } from "@/components/IngredientTable";
import { StatusBadge, TypeBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const product = await api.getProductBySlug(params.slug).catch((err) => {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  });

  const recipes = await api.getRecipesForProduct(product.id);
  const current = recipes.find((r) => r.isCurrent) ?? recipes[0];
  const batches = current ? await api.getBatchesForRecipe(current.id) : [];

  return (
    <>
      <Link href="/lab" className="back-link">
        ← All products
      </Link>

      <h1 className="page-title" style={{ marginTop: 12 }}>
        {product.name}
      </h1>
      {product.description && <p className="page-subtitle">{product.description}</p>}
      <div className="meta-row">
        <TypeBadge type={product.type} />
        <StatusBadge status={product.status} />
        <HeatMeter level={product.heatLevel} />
        {product.targetPrice != null && (
          <span className="badge muted">Target ${product.targetPrice.toFixed(2)}</span>
        )}
      </div>

      <div className="section-title">
        Current formula {current ? `— v${current.version}` : ""}
      </div>
      {current ? (
        <div className="card">
          {current.notes && <p style={{ marginTop: 0 }}>{current.notes}</p>}
          <IngredientTable ingredients={current.ingredients} />
        </div>
      ) : (
        <p className="empty">No recipe versions yet.</p>
      )}

      {recipes.length > 1 && (
        <>
          <div className="section-title">Version history</div>
          <div className="meta-row">
            {recipes.map((r) => (
              <span key={r.id} className={`badge ${r.isCurrent ? "ember" : "muted"}`}>
                v{r.version} · {r.batchCount} batch{r.batchCount === 1 ? "" : "es"}
              </span>
            ))}
          </div>
        </>
      )}

      <div className="section-title">Batch log</div>
      <BatchList batches={batches} />

      {current && (
        <div style={{ marginTop: 16 }}>
          <AddBatchForm recipeId={current.id} />
        </div>
      )}
    </>
  );
}
