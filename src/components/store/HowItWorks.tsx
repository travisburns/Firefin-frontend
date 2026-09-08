const STEPS = [
  { icon: "🔥", title: "Pick your fire", copy: "Choose your meal or sauce." },
  { icon: "❄️", title: "Delivered frozen", copy: "Shipped frozen, packed with care." },
  { icon: "🍳", title: "Cook", copy: "Straight from frozen. Quick and easy." },
  { icon: "🌶️", title: "Burn", copy: "Big flavor, no compromise." }
];

export function HowItWorks() {
  return (
    <section className="band">
      <h2 className="band-title center">How Firefin Works</h2>
      <div className="steps">
        {STEPS.map((step, i) => (
          <div key={step.title} className="step">
            <div className="step-icon" aria-hidden>
              {step.icon}
              <span className="step-num">{i + 1}</span>
            </div>
            <strong>{step.title}</strong>
            <p className="page-subtitle" style={{ margin: 0 }}>
              {step.copy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
