export type API =
  | "auth/login-patient"
  | "auth/register-patient"
  | "hospital/fetch-hospital"
  | "hospital/fetch-hospitals"
  | "hospital/patient-request"
  | "payment/flutterwave/init"
  | "payment/generate-transaction-ref"
  | "payment/wallet-balance";

export interface APIResult<T> {
  message: string;
  result: T;
  error: boolean;
  code: string;
}
