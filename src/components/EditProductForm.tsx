"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import type { Product, ProductStatus } from "@/types/api";

const STATUSES: ProductStatus[] = [
  "Concept",
  "InDevelopment",
  "Locked",
  "Live",
  "Retired"
];

export function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(product.name);
  const [status, setStatus] = useState<ProductStatus>(product.status);
  const [heat, setHeat] = useState(product.heatLevel?.toString() ?? "");
  const [description, setDescription] = useState(product.description ?? "");
  const [targetPrice, setTargetPrice] = useState(product.targetPrice?.toString() ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.updateProduct(product.id, {
        name: name.trim(),
        status,
        heatLevel: heat ? Number(heat) : null,
        description: description.trim() || null,
        targetPrice: targetPrice ? Number(targetPrice) : null
      });
      setOpen(false);
      router.refresh();
    } catch {
      setError("Could not save. Is the API running?");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button className="btn ghost" onClick={() => setOpen(true)}>
        Edit product
      </button>
    );
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="row-2">
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "InDevelopment" ? "In Development" : s}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="heat">Heat (1-5)</label>
          <input id="heat" type="number" min={1} max={5} value={heat} onChange={(e) => setHeat(e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="desc">Description</label>
        <textarea id="desc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="price">Target price ($)</label>
        <input id="price" type="number" step="0.01" min={0} value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} />
      </div>
      {error && <p className="error">{error}</p>}
      <div className="meta-row">
        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button className="btn ghost" type="button" onClick={() => setOpen(false)} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
