import { describe, expect, it } from "vitest";

import { cartOrderSchema } from "./validation";

const validOrder = {
  name: "Test Osoba",
  contact: "test@example.invalid",
  consent: true,
  website: "",
  formStartedAt: 1_700_000_000_000,
  formToken: "a".repeat(64),
  idempotencyKey: "80000000-0000-4000-8000-000000000001",
  items: [{ productId: "70000000-0000-4000-8000-000000000001", quantity: 2 }],
};

describe("cartOrderSchema", () => {
  it("accepts only customer data and minimal cart identifiers", () => {
    expect(cartOrderSchema.parse(validOrder)).toEqual(validOrder);
    expect(cartOrderSchema.safeParse({
      ...validOrder,
      items: [{ ...validOrder.items[0], priceEur: 1, name: "Lažna cena" }],
    }).success).toBe(false);
  });

  it("rejects empty, duplicate and invalid quantities", () => {
    expect(cartOrderSchema.safeParse({ ...validOrder, items: [] }).success).toBe(false);
    expect(cartOrderSchema.safeParse({ ...validOrder, items: [validOrder.items[0], validOrder.items[0]] }).success).toBe(false);
    expect(cartOrderSchema.safeParse({ ...validOrder, items: [{ ...validOrder.items[0], quantity: 0 }] }).success).toBe(false);
  });
});
