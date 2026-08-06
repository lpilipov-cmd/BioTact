export type ProductFormState = { status: "idle" | "error" | "success"; message?: string; fieldErrors?: Record<string, string[] | undefined> };
export const initialProductFormState: ProductFormState = { status: "idle" };
