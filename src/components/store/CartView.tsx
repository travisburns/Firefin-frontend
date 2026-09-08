"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function CartView() {
  const { items, subtotal, setQty, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="card">
        <p className="empty" style={{ margin: 0 }}>
          Your cart is empty.
        </p>
        <div style={{ marginTop: 12 }}>
          <Link href="/shop" className="btn">
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        {items.map((item) => (
          <div key={item.key} className="cart-row">
            <div>
              <strong>{item.title}</strong>
              {item.subtitle && <div className="page-subtitle" style={{ margin: 0 }}>{item.subtitle}</div>}
            </div>
            <div className="qty-controls">
              <button className="btn ghost" onClick={() => setQty(item.key, item.qty - 1)}>
                −
              </button>
              <span className="qty">{item.qty}</span>
              <button className="btn ghost" onClick={() => setQty(item.key, item.qty + 1)}>
                +
              </button>
            </div>
            <div className="line-price">${(item.unitPrice * item.qty).toFixed(2)}</div>
            <button className="btn ghost" onClick={() => removeItem(item.key)} aria-label="Remove">
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="card freezer-summary">
        <div className="summary-row total">
          <span>Subtotal</span>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>
        <p className="fineprint">
          Shipping and taxes are calculated at the next step. Payment is simulated
          until the real gateway is wired up.
        </p>
        <Link href="/checkout" className="btn" style={{ textAlign: "center" }}>
          Checkout
        </Link>
        <button className="btn ghost" onClick={clear}>
          Clear cart
        </button>
      </div>
    </>
  );
}
