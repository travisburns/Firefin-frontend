import type { ProductStatus, ProductType } from "@/types/api";

const STATUS_TONE: Record<ProductStatus, string> = {
  Concept: "muted",
  InDevelopment: "ember",
  Locked: "flame",
  Live: "flame",
  Retired: "muted"
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  const label = status === "InDevelopment" ? "In Development" : status;
  return <span className={`badge ${STATUS_TONE[status]}`}>{label}</span>;
}

export function TypeBadge({ type }: { type: ProductType }) {
  const label = type === "FireDrop" ? "Fire Drop" : type;
  return <span className="badge">{label}</span>;
}
