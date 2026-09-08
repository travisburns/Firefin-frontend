"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

export interface CartItem {
  /** Stable identity for merging (e.g. product slug, or a freezer-box id). */
  key: string;
  title: string;
  subtitle?: string;
  unitPrice: number;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

const STORAGE_KEY = "firefin-cart";
const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount (client-only; storage may be empty or blocked).
  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  // Persist after hydration so we never clobber stored state with the empty seed.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — cart stays in-memory for this session */
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (item: CartItem) =>
      setItems((prev) => {
        const existing = prev.find((i) => i.key === item.key);
        if (existing) {
          return prev.map((i) =>
            i.key === item.key ? { ...i, qty: i.qty + item.qty } : i
          );
        }
        return [...prev, item];
      });

    const setQty = (key: string, qty: number) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => i.key !== key)
          : prev.map((i) => (i.key === key ? { ...i, qty } : i))
      );

    const removeItem = (key: string) =>
      setItems((prev) => prev.filter((i) => i.key !== key));

    const clear = () => setItems([]);

    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

    return { items, count, subtotal, addItem, setQty, removeItem, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
