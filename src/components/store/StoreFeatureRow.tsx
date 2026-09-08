const FEATURES = [
  { icon: "❄️", title: "Keep frozen", copy: "Meals arrive frozen and stay that way." },
  { icon: "🔥", title: "Cook from frozen", copy: "No thawing. Just cook and enjoy." },
  { icon: "🌶️", title: "Bold ingredients", copy: "Real food. Real peppers. Real flavor." },
  { icon: "📦", title: "Delivered cold", copy: "Packed with care, delivered to your door." }
];

export function StoreFeatureRow() {
  return (
    <section className="feature-row">
      {FEATURES.map((f) => (
        <div key={f.title} className="feature">
          <span className="feature-icon" aria-hidden>
            {f.icon}
          </span>
          <div>
            <strong>{f.title}</strong>
            <p className="page-subtitle" style={{ margin: 0 }}>
              {f.copy}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
