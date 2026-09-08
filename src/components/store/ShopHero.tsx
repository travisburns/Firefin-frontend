export function ShopHero({
  title,
  tagline,
  blurb,
  image
}: {
  title: string;
  tagline: string;
  blurb: string;
  image: string;
}) {
  return (
    <section className="shop-hero">
      <div className="shop-hero-copy">
        <h1 className="hero-title">{title}</h1>
        <p className="shop-hero-tag">{tagline}</p>
        <p className="hero-sub">{blurb}</p>
        <div className="pill-row">
          <span className="pill">🌶️ Big flavor</span>
          <span className="pill">❄️ Keep frozen</span>
          <span className="pill">🔥 Cook from frozen</span>
        </div>
      </div>
      <div
        className="shop-hero-visual"
        style={{ backgroundImage: `url('${image}')` }}
        role="img"
        aria-label={title}
      />
    </section>
  );
}
