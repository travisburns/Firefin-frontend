import type { Product } from "@/types/api";

/**
 * A product is offered to customers only once its recipe is Locked (or Live).
 * This keeps the storefront honest with the blueprint: nothing sells until the
 * product has actually been mastered.
 */
export function isSellable(product: Product): boolean {
  return product.status === "Locked" || product.status === "Live";
}

export function sellable(products: Product[]): Product[] {
  return products.filter(isSellable);
}
