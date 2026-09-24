import { z } from "zod";

export const CART_STORAGE_KEY = "biotact-cart-v1";
export const MAX_CART_QUANTITY = 99;

const cartItemSchema = z
  .object({
    id: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().min(1).max(240),
    priceEur: z.number().finite().nonnegative(),
    imagePath: z.string().startsWith("/").nullable(),
    quantity: z.number().int().min(1).max(MAX_CART_QUANTITY),
  })
  .strict();

const storedCartSchema = z
  .object({
    version: z.literal(1),
    items: z.array(cartItemSchema).max(100),
  })
  .strict();

export type CartItem = z.infer<typeof cartItemSchema>;
export type CartProduct = Omit<CartItem, "quantity">;

export type CartAction =
  | Readonly<{ type: "hydrate"; items: readonly CartItem[] }>
  | Readonly<{ type: "add"; product: CartProduct }>
  | Readonly<{ type: "increase"; id: string }>
  | Readonly<{ type: "decrease"; id: string }>
  | Readonly<{ type: "remove"; id: string }>
  | Readonly<{ type: "clear" }>;

export function cartReducer(items: readonly CartItem[], action: CartAction): CartItem[] {
  if (action.type === "hydrate") return [...action.items];
  if (action.type === "clear") return [];
  if (action.type === "remove") return items.filter((item) => item.id !== action.id);

  if (action.type === "add") {
    const existing = items.find((item) => item.id === action.product.id);
    if (!existing) return [...items, { ...action.product, quantity: 1 }];

    return items.map((item) =>
      item.id === action.product.id
        ? { ...item, quantity: Math.min(MAX_CART_QUANTITY, item.quantity + 1) }
        : item,
    );
  }

  return items.map((item) => {
    if (item.id !== action.id) return item;
    if (action.type === "increase") {
      return { ...item, quantity: Math.min(MAX_CART_QUANTITY, item.quantity + 1) };
    }
    return { ...item, quantity: Math.max(1, item.quantity - 1) };
  });
}

export function parseStoredCart(value: string | null): CartItem[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    const result = storedCartSchema.safeParse(parsed);
    return result.success ? result.data.items : [];
  } catch {
    return [];
  }
}

export function serializeCart(items: readonly CartItem[]) {
  return JSON.stringify({ version: 1, items: cartItemSchema.array().parse(items) });
}

export function getCartItemCount(items: readonly CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal(items: readonly CartItem[]) {
  return items.reduce((total, item) => total + item.priceEur * item.quantity, 0);
}
