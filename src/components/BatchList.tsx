import type { Batch } from "@/types/api";

function categoryLabel(category: string): string {
  return category === "CheeseMelt" ? "Cheese Melt" : category;
}

function BatchNoteRow({
  category,
  worked,
  didnt,
  severity
}: {
  category: string;
  worked: string | null;
  didnt: string | null;
  severity: number;
}) {
  return (
    <div className="note">
      <span className="cat">{categoryLabel(category)}</span>{" "}
      <span className="badge muted">sev {severity}</span>
      {worked && (
        <div className="worked">
          ✓ {worked}
        </div>
      )}
      {didnt && (
        <div className="didnt">
          ✗ {didnt}
        </div>
      )}
    </div>
  );
}

export function BatchList({ batches }: { batches: Batch[] }) {
  if (batches.length === 0) {
    return <p className="empty">No batches logged yet. Add the first one below.</p>;
  }

  return (
    <div className="card-grid" style={{ gridTemplateColumns: "1fr" }}>
      {batches.map((b) => (
        <div key={b.id} className="card batch">
          <div className="batch-head">
            <strong>Batch #{b.batchNumber}</strong>
            <span className="badge muted">
              {b.madeOn}
              {b.madeBy ? ` · ${b.madeBy}` : ""}
            </span>
          </div>
          <div className="meta-row">
            {b.rating != null && <span className="badge ember">Rating {b.rating}/5</span>}
            {b.verdict && <span className="badge">{b.verdict}</span>}
          </div>
          {b.summary && <p style={{ marginBottom: 0 }}>{b.summary}</p>}
          {b.notes.map((n) => (
            <BatchNoteRow
              key={n.id}
              category={n.category}
              worked={n.whatWorked}
              didnt={n.whatDidnt}
              severity={n.severity}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
