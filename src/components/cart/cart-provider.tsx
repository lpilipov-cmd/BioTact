"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import {
  CART_STORAGE_KEY,
  cartReducer,
  getCartItemCount,
  getCartTotal,
  parseStoredCart,
  serializeCart,
  type CartAction,
  type CartItem,
  type CartProduct,
} from "@/lib/cart/cart";

type CartContextValue = Readonly<{
  items: readonly CartItem[];
  itemCount: number;
  totalEur: number;
  hydrated: boolean;
  addProduct: (product: CartProduct) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}>;

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderState = Readonly<{ items: readonly CartItem[]; hydrated: boolean }>;

function providerReducer(state: CartProviderState, action: CartAction): CartProviderState {
  return {
    items: cartReducer(state.items, action),
    hydrated: action.type === "hydrate" ? true : state.hydrated,
  };
}

export function CartProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [{ items, hydrated }, dispatch] = useReducer(providerReducer, { items: [], hydrated: false });

  useEffect(() => {
    let storedItems: readonly CartItem[] = [];
    try {
      storedItems = parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY));
    } catch {
      // Start with an empty cart when browser storage is unavailable.
    }
    dispatch({ type: "hydrate", items: storedItems });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(items));
    } catch {
      // The cart remains usable for this page view when browser storage is unavailable.
    }
  }, [hydrated, items]);

  const addProduct = useCallback((product: CartProduct) => dispatch({ type: "add", product }), []);
  const increase = useCallback((id: string) => dispatch({ type: "increase", id }), []);
  const decrease = useCallback((id: string) => dispatch({ type: "decrease", id }), []);
  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: getCartItemCount(items),
      totalEur: getCartTotal(items),
      hydrated,
      addProduct,
      increase,
      decrease,
      remove,
      clear,
    }),
    [addProduct, clear, decrease, hydrated, increase, items, remove],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

export function useOptionalCart() {
  return useContext(CartContext);
}
