export type RecoveryState = Readonly<{
  message: string | null;
  success: boolean;
}>;

export const initialRecoveryState: RecoveryState = {
  message: null,
  success: false,
};
