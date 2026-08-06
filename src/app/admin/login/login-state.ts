export type LoginState = Readonly<{
  message: string | null;
}>;

export const initialLoginState: LoginState = {
  message: null,
};
