"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function StoreHeader() {
  const { count } = useCart();
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand">
          FIRE<span className="spark">FIN</span>
        </Link>
        <nav className="store-nav">
          <Link href="/shop">Shop</Link>
          <Link href="/build-your-freezer">Build Your Freezer</Link>
        </nav>
        <Link href="/cart" className="cart-link">
          Cart{count > 0 ? <span className="cart-count">{count}</span> : null}
        </Link>
      </div>
    </header>
  );
}
