import type {
  Batch,
  CreateBatch,
  CreateOrder,
  CreateRecipe,
  Order,
  Product,
  Recipe,
  UpdateProduct
} from "@/types/api";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5080";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function extractError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body?.error ?? body?.title ?? fallback;
  } catch {
    return fallback;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    // The Lab is an internal tool: always show fresh data.
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init
  });

  if (!res.ok) {
    const message = await extractError(res, `${init?.method ?? "GET"} ${path} failed (${res.status})`);
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  getProducts: () => request<Product[]>("/api/products"),
  getProductBySlug: (slug: string) =>
    request<Product>(`/api/products/slug/${encodeURIComponent(slug)}`),
  updateProduct: (id: number, body: UpdateProduct) =>
    request<Product>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(body)
    }),
  getRecipesForProduct: (productId: number) =>
    request<Recipe[]>(`/api/products/${productId}/recipes`),
  createRecipe: (productId: number, body: CreateRecipe) =>
    request<Recipe>(`/api/products/${productId}/recipes`, {
      method: "POST",
      body: JSON.stringify(body)
    }),
  getBatchesForRecipe: (recipeId: number) =>
    request<Batch[]>(`/api/recipes/${recipeId}/batches`),
  createBatch: (recipeId: number, body: CreateBatch) =>
    request<Batch>(`/api/recipes/${recipeId}/batches`, {
      method: "POST",
      body: JSON.stringify(body)
    }),
  createOrder: (body: CreateOrder) =>
    request<Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify(body)
    }),
  payOrder: (orderId: number) =>
    request<Order>(`/api/orders/${orderId}/pay`, { method: "POST" }),
  getOrderByNumber: (orderNumber: string) =>
    request<Order>(`/api/orders/number/${encodeURIComponent(orderNumber)}`)
};

export { ApiError };
