"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { useCart, type CartItem } from "@/lib/cart";
import type { CreateOrderItem } from "@/types/api";

const FREEZER_BOX_PREFIX = "freezer-box-";

function toOrderItem(item: CartItem): CreateOrderItem {
  const isBox = item.key.startsWith(FREEZER_BOX_PREFIX);
  return {
    productSlug: isBox ? null : item.key,
    title: item.title,
    subtitle: item.subtitle ?? null,
    unitPrice: item.unitPrice,
    quantity: item.qty
  };
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    shippingLine1: "",
    shippingLine2: "",
    shippingCity: "",
    shippingRegion: "",
    shippingPostalCode: "",
    shippingCountry: "USA"
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPlacing(true);
    setError(null);
    try {
      const order = await api.createOrder({
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        shippingLine1: form.shippingLine1.trim(),
        shippingLine2: form.shippingLine2.trim() || null,
        shippingCity: form.shippingCity.trim(),
        shippingRegion: form.shippingRegion.trim() || null,
        shippingPostalCode: form.shippingPostalCode.trim(),
        shippingCountry: form.shippingCountry.trim(),
        items: items.map(toOrderItem)
      });

      // Simulated payment capture — the real gateway comes later.
      await api.payOrder(order.id);

      clear();
      router.push(`/order/${order.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place the order.");
      setPlacing(false);
    }
  }

  return (
    <div className="checkout-grid">
      <form className="card form-grid" onSubmit={handleSubmit}>
        <div className="section-title" style={{ margin: "0 0 4px" }}>Contact</div>
        <div className="row-2">
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" required value={form.customerName} onChange={(e) => set("customerName", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={form.customerEmail} onChange={(e) => set("customerEmail", e.target.value)} />
          </div>
        </div>

        <div className="section-title" style={{ margin: "8px 0 4px" }}>Shipping</div>
        <div className="field">
          <label htmlFor="line1">Address</label>
          <input id="line1" required value={form.shippingLine1} onChange={(e) => set("shippingLine1", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="line2">Address line 2 (optional)</label>
          <input id="line2" value={form.shippingLine2} onChange={(e) => set("shippingLine2", e.target.value)} />
        </div>
        <div className="row-2">
          <div className="field">
            <label htmlFor="city">City</label>
            <input id="city" required value={form.shippingCity} onChange={(e) => set("shippingCity", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="region">State / Region</label>
            <input id="region" value={form.shippingRegion} onChange={(e) => set("shippingRegion", e.target.value)} />
          </div>
        </div>
        <div className="row-2">
          <div className="field">
            <label htmlFor="postal">Postal code</label>
            <input id="postal" required value={form.shippingPostalCode} onChange={(e) => set("shippingPostalCode", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="country">Country</label>
            <input id="country" required value={form.shippingCountry} onChange={(e) => set("shippingCountry", e.target.value)} />
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="btn" type="submit" disabled={placing}>
          {placing ? "Placing order…" : `Pay $${subtotal.toFixed(2)} (simulated)`}
        </button>
        <p className="fineprint">
          Payment is simulated for now — placing the order marks it paid so we can
          exercise the full flow before wiring a real gateway.
        </p>
      </form>

      <div className="card freezer-summary">
        <div className="section-title" style={{ margin: "0 0 4px" }}>Order summary</div>
        {items.map((item) => (
          <div key={item.key} className="summary-row">
            <span>
              {item.qty}× {item.title}
            </span>
            <span>${(item.unitPrice * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-row total">
          <span>Subtotal</span>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}
