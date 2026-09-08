// TypeScript mirrors of the Firefin.Api DTOs. Enums serialize as strings.

export type ProductType = "Meal" | "Sauce" | "FireDrop";

export type ProductStatus =
  | "Concept"
  | "InDevelopment"
  | "Locked"
  | "Live"
  | "Retired";

export type NoteCategory =
  | "Moisture"
  | "Heat"
  | "Adhesion"
  | "CheeseMelt"
  | "Separation"
  | "Cook"
  | "Texture"
  | "Packaging"
  | "Flavor"
  | "Other";

export interface Product {
  id: number;
  slug: string;
  name: string;
  type: ProductType;
  status: ProductStatus;
  heatLevel: number | null;
  description: string | null;
  targetPrice: number | null;
  recipeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  id: number;
  name: string;
  grams: number;
  notes: string | null;
  sortOrder: number;
}

export interface Recipe {
  id: number;
  productId: number;
  version: number;
  isCurrent: boolean;
  notes: string | null;
  createdAt: string;
  ingredients: RecipeIngredient[];
  batchCount: number;
}

export interface BatchNote {
  id: number;
  category: NoteCategory;
  whatWorked: string | null;
  whatDidnt: string | null;
  severity: number;
}

export interface Batch {
  id: number;
  recipeId: number;
  batchNumber: number;
  madeOn: string;
  madeBy: string | null;
  rating: number | null;
  verdict: string | null;
  summary: string | null;
  createdAt: string;
  notes: BatchNote[];
}

export interface UpdateProduct {
  name: string;
  status: ProductStatus;
  heatLevel: number | null;
  description: string | null;
  targetPrice: number | null;
}

export interface CreateRecipeIngredient {
  name: string;
  grams: number;
  notes: string | null;
  sortOrder: number;
}

export interface CreateRecipe {
  notes: string | null;
  ingredients: CreateRecipeIngredient[];
}

export interface CreateBatchNote {
  category: NoteCategory;
  whatWorked: string | null;
  whatDidnt: string | null;
  severity: number;
}

export interface CreateBatch {
  madeOn: string;
  madeBy: string | null;
  rating: number | null;
  verdict: string | null;
  summary: string | null;
  notes: CreateBatchNote[];
}
