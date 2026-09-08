const LEVELS = [
  { name: "Ember", note: "Mild warmth" },
  { name: "Flame", note: "Comfortable heat" },
  { name: "Blaze", note: "Bring the heat" },
  { name: "Inferno", note: "Serious fire" },
  { name: "Wildfire", note: "Extreme heat" }
];

export function HeatScale() {
  return (
    <section className="band heat-scale">
      <div className="heat-scale-head">
        <h2 className="band-title">Pick Your Fire</h2>
        <p className="page-subtitle" style={{ margin: 0 }}>
          Find the heat that fits you.
        </p>
      </div>
      <div className="heat-track">
        {LEVELS.map((lvl, i) => (
          <div key={lvl.name} className="heat-stop">
            <span className="heat-flame" aria-hidden>
              {"🔥"}
            </span>
            <span className="heat-name" style={{ opacity: 0.55 + i * 0.11 }}>
              {lvl.name}
            </span>
            <span className="heat-note">{lvl.note}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
