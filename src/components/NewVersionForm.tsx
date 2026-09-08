"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import type { Recipe } from "@/types/api";

interface Row {
  name: string;
  grams: string;
  notes: string;
}

function seedRows(current?: Recipe): Row[] {
  if (current && current.ingredients.length > 0) {
    return current.ingredients.map((i) => ({
      name: i.name,
      grams: i.grams.toString(),
      notes: i.notes ?? ""
    }));
  }
  return [{ name: "", grams: "", notes: "" }];
}

export function NewVersionForm({
  productId,
  current,
  nextVersion
}: {
  productId: number;
  current?: Recipe;
  nextVersion: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState<Row[]>(seedRows(current));

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { name: "", grams: "", notes: "" }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const ingredients = rows
      .filter((r) => r.name.trim() !== "")
      .map((r, idx) => ({
        name: r.name.trim(),
        grams: r.grams ? Number(r.grams) : 0,
        notes: r.notes.trim() || null,
        sortOrder: idx + 1
      }));

    try {
      await api.createRecipe(productId, { notes: notes.trim() || null, ingredients });
      setNotes("");
      setOpen(false);
      router.refresh();
    } catch {
      setError("Could not save the version. Is the API running?");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button className="btn ghost" onClick={() => setOpen(true)}>
        + New formula version
      </button>
    );
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <p className="page-subtitle" style={{ margin: 0 }}>
        Saving creates <strong>v{nextVersion}</strong> and makes it current
        {current ? " (seeded from the current formula)" : ""}.
      </p>

      <table className="table">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th className="grams">Grams</th>
            <th>Notes</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                <input value={row.name} onChange={(e) => updateRow(i, { name: e.target.value })} placeholder="e.g. Blueberry" />
              </td>
              <td className="grams">
                <input type="number" step="0.1" min={0} value={row.grams} onChange={(e) => updateRow(i, { grams: e.target.value })} />
              </td>
              <td>
                <input value={row.notes} onChange={(e) => updateRow(i, { notes: e.target.value })} />
              </td>
              <td>
                <button className="btn ghost" type="button" onClick={() => removeRow(i)} aria-label="Remove row">
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button className="btn ghost" type="button" onClick={addRow}>
          + Add ingredient
        </button>
      </div>

      <div className="field">
        <label htmlFor="vnotes">Version notes</label>
        <textarea id="vnotes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What changed vs the last version and why" />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="meta-row">
        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Saving…" : `Save v${nextVersion}`}
        </button>
        <button className="btn ghost" type="button" onClick={() => setOpen(false)} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
