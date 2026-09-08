import { CartProvider } from "@/lib/cart";
import { StoreHeader } from "@/components/store/StoreHeader";

export default function StoreLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <StoreHeader />
      <main className="container">{children}</main>
      <footer className="site-footer">
        <div className="container">
          <span className="brand">
            FIRE<span className="spark">FIN</span>
          </span>
          <span className="tagline">Set your freezer on fire.</span>
        </div>
      </footer>
    </CartProvider>
  );
}
