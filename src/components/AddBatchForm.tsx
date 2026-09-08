"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import type { NoteCategory } from "@/types/api";

const CATEGORIES: NoteCategory[] = [
  "Flavor",
  "Heat",
  "Texture",
  "Moisture",
  "Adhesion",
  "CheeseMelt",
  "Separation",
  "Cook",
  "Packaging",
  "Other"
];

const today = () => new Date().toISOString().slice(0, 10);

export function AddBatchForm({ recipeId }: { recipeId: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [madeOn, setMadeOn] = useState(today());
  const [madeBy, setMadeBy] = useState("");
  const [rating, setRating] = useState("");
  const [verdict, setVerdict] = useState("");
  const [summary, setSummary] = useState("");
  const [noteCategory, setNoteCategory] = useState<NoteCategory>("Flavor");
  const [worked, setWorked] = useState("");
  const [didnt, setDidnt] = useState("");
  const [severity, setSeverity] = useState("1");

  function reset() {
    setMadeBy("");
    setRating("");
    setVerdict("");
    setSummary("");
    setWorked("");
    setDidnt("");
    setSeverity("1");
    setNoteCategory("Flavor");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const hasNote = worked.trim() !== "" || didnt.trim() !== "";

    try {
      await api.createBatch(recipeId, {
        madeOn,
        madeBy: madeBy.trim() || null,
        rating: rating ? Number(rating) : null,
        verdict: verdict.trim() || null,
        summary: summary.trim() || null,
        notes: hasNote
          ? [
              {
                category: noteCategory,
                whatWorked: worked.trim() || null,
                whatDidnt: didnt.trim() || null,
                severity: Number(severity)
              }
            ]
          : []
      });
      reset();
      setOpen(false);
      router.refresh();
    } catch {
      setError("Could not save the batch. Is the API running?");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button className="btn" onClick={() => setOpen(true)}>
        + Log a batch
      </button>
    );
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="row-2">
        <div className="field">
          <label htmlFor="madeOn">Made on</label>
          <input id="madeOn" type="date" value={madeOn} onChange={(e) => setMadeOn(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="madeBy">Made by</label>
          <input id="madeBy" value={madeBy} onChange={(e) => setMadeBy(e.target.value)} placeholder="Name" />
        </div>
      </div>

      <div className="row-2">
        <div className="field">
          <label htmlFor="rating">Rating (1-5)</label>
          <input id="rating" type="number" min={1} max={5} value={rating} onChange={(e) => setRating(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="verdict">Verdict</label>
          <input id="verdict" value={verdict} onChange={(e) => setVerdict(e.target.value)} placeholder="e.g. keep direction" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="summary">Summary</label>
        <textarea id="summary" rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} />
      </div>

      <div className="section-title" style={{ margin: "4px 0 0" }}>Observation (optional)</div>
      <div className="row-2">
        <div className="field">
          <label htmlFor="cat">Category</label>
          <select id="cat" value={noteCategory} onChange={(e) => setNoteCategory(e.target.value as NoteCategory)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "CheeseMelt" ? "Cheese Melt" : c}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sev">Severity (1-5)</label>
          <input id="sev" type="number" min={1} max={5} value={severity} onChange={(e) => setSeverity(e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="worked">What worked</label>
        <input id="worked" value={worked} onChange={(e) => setWorked(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="didnt">What didn&apos;t</label>
        <input id="didnt" value={didnt} onChange={(e) => setDidnt(e.target.value)} />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="meta-row">
        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save batch"}
        </button>
        <button className="btn ghost" type="button" onClick={() => setOpen(false)} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
