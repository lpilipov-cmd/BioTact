export type PackageFormState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors?: Readonly<Record<string, string[] | undefined>>;
}>;

export const initialPackageFormState: PackageFormState = {
  status: "idle",
  message: null,
};
