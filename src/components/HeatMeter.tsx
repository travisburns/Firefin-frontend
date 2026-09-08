export function HeatMeter({ level }: { level: number | null }) {
  if (level == null) {
    return <span className="badge muted">Heat TBD</span>;
  }
  const pips = [1, 2, 3, 4, 5];
  return (
    <span className="heat" title={`Heat ${level}/5`} aria-label={`Heat ${level} of 5`}>
      {pips.map((p) => (
        <span key={p} className={`pip ${p <= level ? "on" : ""}`} />
      ))}
    </span>
  );
}
