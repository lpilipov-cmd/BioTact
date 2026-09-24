import { describe, expect, it } from "vitest";

import {
  cartReducer,
  getCartItemCount,
  getCartTotal,
  parseStoredCart,
  serializeCart,
  type CartProduct,
} from "./cart";

const product: CartProduct = {
  id: "product-1",
  slug: "pro-12-kapsule-81180",
  name: "Pro 12+ kapsule",
  priceEur: 73.88,
  imagePath: "/products/81180/product.webp",
};

describe("cart state", () => {
  it("adds products, adjusts quantity safely and removes products", () => {
    const added = cartReducer([], { type: "add", product });
    const increased = cartReducer(added, { type: "increase", id: product.id });
    const decreased = cartReducer(increased, { type: "decrease", id: product.id });
    const clamped = cartReducer(decreased, { type: "decrease", id: product.id });

    expect(added[0]?.quantity).toBe(1);
    expect(increased[0]?.quantity).toBe(2);
    expect(decreased[0]?.quantity).toBe(1);
    expect(clamped[0]?.quantity).toBe(1);
    expect(cartReducer(clamped, { type: "remove", id: product.id })).toEqual([]);
  });

  it("persists only the validated public cart shape", () => {
    const items = [{ ...product, quantity: 2 }];
    expect(parseStoredCart(serializeCart(items))).toEqual(items);
    expect(parseStoredCart('{"version":1,"items":[{"id":"x","partnerPrice":1}]}')).toEqual([]);
    expect(parseStoredCart("not-json")).toEqual([]);
  });

  it("calculates quantity and EUR totals", () => {
    const items = [
      { ...product, quantity: 2 },
      { ...product, id: "product-2", slug: "fiber-boost-80630", priceEur: 42.24, quantity: 1 },
    ];

    expect(getCartItemCount(items)).toBe(3);
    expect(getCartTotal(items)).toBeCloseTo(190);
  });
});
