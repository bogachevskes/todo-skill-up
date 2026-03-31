export interface ISignIn {
  email: string | null;
  password: string | null;
}

export interface ISignInResponse {
  token: string;
  userId: number;
}

export interface ISignUp {
  confirm_password: string | null;
  email: string | null;
  name: string | null;
  password: string | null;
  terms_agree: boolean;
}
