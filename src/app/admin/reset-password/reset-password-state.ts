export type ResetPasswordState = Readonly<{
  message: string | null;
}>;

export const initialResetPasswordState: ResetPasswordState = {
  message: null,
};
