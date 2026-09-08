"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import type { Product, ProductStatus } from "@/types/api";

export function ProductStatusActions({
  product,
  hasCurrentRecipe
}: {
  product: Product;
  hasCurrentRecipe: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(status: ProductStatus) {
    setBusy(true);
    setError(null);
    try {
      await api.updateProduct(product.id, {
        name: product.name,
        status,
        heatLevel: product.heatLevel,
        description: product.description,
        targetPrice: product.targetPrice
      });
      router.refresh();
    } catch {
      setError("Could not update status.");
    } finally {
      setBusy(false);
    }
  }

  const isLocked = product.status === "Locked" || product.status === "Live";

  return (
    <div className="meta-row">
      {isLocked ? (
        <button className="btn ghost" onClick={() => setStatus("InDevelopment")} disabled={busy}>
          Reopen for development
        </button>
      ) : (
        <button
          className="btn"
          onClick={() => setStatus("Locked")}
          disabled={busy || !hasCurrentRecipe}
          title={hasCurrentRecipe ? "Lock the current formula" : "Add a formula version first"}
        >
          {busy ? "Working…" : "Lock formula"}
        </button>
      )}
      {error && <span className="error">{error}</span>}
    </div>
  );
}
