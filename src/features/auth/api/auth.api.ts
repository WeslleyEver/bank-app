/**
 * API de autenticação.
 * Comunica apenas com nosso backend (nunca IDEZ diretamente).
 * Retorna data em sucesso; lança em erro.
 *
 * TODO: integrar com httpClient real quando disponível.
 * Ex: const res = await httpClient.post('/auth/login', data);
 * if (!res.success) throw new ApiError(res.error);
 * return res.data;
 */

import type {
  LoginApiRequest,
  LoginApiData,
  ForgotPasswordApiRequest,
  ForgotPasswordApiData,
  RegisterPFApiRequest,
  RegisterPFApiData,
  RegisterPJApiRequest,
  RegisterPJApiData,
  ApiUser,
} from "./auth.api.types";

const MOCK_DELAY = 300;

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * POST /auth/login
 * Request: { documento, senha }
 */
export async function loginApi(data: LoginApiRequest): Promise<LoginApiData> {
  await delay(MOCK_DELAY);
  throw new Error(
    "[auth.api] login: integrar com backend. POST /auth/login"
  );
}

/**
 * POST /auth/forgot-password
 * Request: { documento }
 */
export async function forgotPasswordApi(
  data: ForgotPasswordApiRequest
): Promise<ForgotPasswordApiData> {
  await delay(MOCK_DELAY);
  throw new Error(
    "[auth.api] forgotPassword: integrar com backend. POST /auth/forgot-password"
  );
}

/**
 * POST /auth/register/pf
 */
export async function registerPFApi(
  data: RegisterPFApiRequest
): Promise<RegisterPFApiData> {
  await delay(MOCK_DELAY);
  throw new Error(
    "[auth.api] registerPF: integrar com backend. POST /auth/register/pf"
  );
}

/**
 * POST /auth/register/pj
 */
export async function registerPJApi(
  data: RegisterPJApiRequest
): Promise<RegisterPJApiData> {
  await delay(MOCK_DELAY);
  throw new Error(
    "[auth.api] registerPJ: integrar com backend. POST /auth/register/pj"
  );
}

/**
 * GET /auth/me
 * Headers: Authorization: Bearer {token}
 * Usado para hidratar usuário após login ou reabertura do app.
 */
export async function meApi(accessToken: string): Promise<ApiUser> {
  await delay(MOCK_DELAY);
  throw new Error(
    "[auth.api] me: integrar com backend. GET /auth/me"
  );
}
