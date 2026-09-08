import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params
}: {
  params: { orderNumber: string };
}) {
  const order = await api.getOrderByNumber(params.orderNumber).catch((err) => {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  });

  return (
    <>
      <div className="confirm-banner card">
        <span className="eyebrow" style={{ margin: 0 }}>Order {order.status}</span>
        <h1 className="page-title" style={{ margin: "8px 0 4px" }}>
          Thanks, {order.customerName.split(" ")[0] || "friend"}!
        </h1>
        <p className="page-subtitle" style={{ margin: 0 }}>
          Your order <strong>{order.orderNumber}</strong> is confirmed. A receipt
          would go to {order.customerEmail}.
        </p>
      </div>

      <div className="section-title">Items</div>
      <div className="card">
        {order.items.map((item) => (
          <div key={item.id} className="summary-row">
            <span>
              {item.quantity}× {item.title}
              {item.subtitle ? ` — ${item.subtitle}` : ""}
            </span>
            <span>${item.lineTotal.toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-row total">
          <span>Subtotal</span>
          <strong>${order.subtotal.toFixed(2)}</strong>
        </div>
      </div>

      <div className="section-title">Shipping to</div>
      <div className="card">
        <p style={{ margin: 0 }}>
          {order.shippingLine1}
          {order.shippingLine2 ? `, ${order.shippingLine2}` : ""}
          <br />
          {order.shippingCity}
          {order.shippingRegion ? `, ${order.shippingRegion}` : ""} {order.shippingPostalCode}
          <br />
          {order.shippingCountry}
        </p>
      </div>

      <div style={{ marginTop: 20 }}>
        <Link href="/shop" className="btn">
          Keep shopping
        </Link>
      </div>
    </>
  );
}
