import type {
  Batch,
  CreateBatch,
  CreateRecipe,
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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    // The Lab is an internal tool: always show fresh data.
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init
  });

  if (!res.ok) {
    throw new ApiError(res.status, `${init?.method ?? "GET"} ${path} failed (${res.status})`);
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
    })
};

export { ApiError };
