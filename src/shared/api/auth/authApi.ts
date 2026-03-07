/**
 * ------------------------------------------------------------------
 * Auth API - Placeholder para integração com backend
 * ------------------------------------------------------------------
 *
 * Contratos e funções preparados para chamadas ao backend.
 * Substituir implementação mock pelas requisições HTTP reais.
 *
 * Exemplo de uso com fetch/axios:
 * const res = await fetch(`${BASE_URL}/auth/login`, {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify(data),
 * });
 * return res.json();
 * ------------------------------------------------------------------
 */

import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  RegisterPFRequest,
  RegisterPJRequest,
  RegisterResponse,
} from "./authApi.types";

const MOCK_DELAY = 500;

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Realiza login.
 * TODO: substituir por fetch/axios para endpoint POST /auth/login
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  await delay(MOCK_DELAY);
  // Placeholder: em produção, fazer requisição ao backend
  throw new Error(
    "[authApi] login: integrar com backend. Ex: POST /auth/login"
  );
}

/**
 * Solicita recuperação de senha.
 * TODO: substituir por fetch/axios para endpoint POST /auth/forgot-password
 */
export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {
  await delay(MOCK_DELAY);
  throw new Error(
    "[authApi] forgotPassword: integrar com backend. Ex: POST /auth/forgot-password"
  );
}

/**
 * Cadastra Pessoa Física.
 * TODO: substituir por fetch/axios para endpoint POST /auth/register/pf
 */
export async function registerPF(
  data: RegisterPFRequest
): Promise<RegisterResponse> {
  await delay(MOCK_DELAY);
  throw new Error(
    "[authApi] registerPF: integrar com backend. Ex: POST /auth/register/pf"
  );
}

/**
 * Cadastra Pessoa Jurídica.
 * TODO: substituir por fetch/axios para endpoint POST /auth/register/pj
 */
export async function registerPJ(
  data: RegisterPJRequest
): Promise<RegisterResponse> {
  await delay(MOCK_DELAY);
  throw new Error(
    "[authApi] registerPJ: integrar com backend. Ex: POST /auth/register/pj"
  );
}
