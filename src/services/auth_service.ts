import axios from "axios";

export interface AuthTokens {
  access_token: string;
  id_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  email_verified: boolean;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface SignUpResponse {
  user_id: string;
  confirmed: boolean;
}

export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  const response = await axios.post<SignUpResponse>("/v1/api/auth/signup", data);
  return response.data;
}

export async function confirmSignUp(username: string, confirmationCode: string): Promise<void> {
  await axios.post("/v1/api/auth/confirm-signup", {
    username,
    confirmation_code: confirmationCode,
  });
}

export async function resendConfirmationCode(username: string): Promise<void> {
  await axios.post("/v1/api/auth/resend-confirmation-code", { username });
}

export async function signIn(email: string, password: string): Promise<AuthTokens> {
  const response = await axios.post<AuthTokens>("/v1/api/auth/signin", {
    email,
    password,
  });
  return response.data;
}

export async function forgotPassword(email: string): Promise<void> {
  await axios.post("/v1/api/auth/forgot-password", { email });
}

export async function confirmForgotPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<void> {
  await axios.post("/v1/api/auth/confirm-forgot-password", {
    email,
    code,
    new_password: newPassword,
  });
}

export async function refreshToken(refreshToken: string, username: string): Promise<AuthTokens> {
  const response = await axios.post<AuthTokens>("/v1/api/auth/refresh", {
    refresh_token: refreshToken,
    username,
  });
  return response.data;
}

export async function getUser(accessToken: string): Promise<User> {
  const response = await axios.get<User>("/v1/api/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}

export async function signOut(accessToken: string): Promise<void> {
  await axios.post(
    "/v1/api/auth/signout",
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
}
