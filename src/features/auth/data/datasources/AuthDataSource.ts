/**
 * Interface do data source de autenticação.
 * Permite alternar entre backend real e mock sem alterar services.
 */

import type {
  LoginApiRequest,
  LoginApiData,
  RegisterPFApiRequest,
  RegisterPFApiData,
  RegisterPJApiRequest,
  RegisterPJApiData,
  ForgotPasswordApiRequest,
  ForgotPasswordApiData,
  ApiUser,
} from "../../api/auth.api.types";

export interface AuthDataSource {
  login(data: LoginApiRequest): Promise<LoginApiData>;
  registerPF(data: RegisterPFApiRequest): Promise<RegisterPFApiData>;
  registerPJ(data: RegisterPJApiRequest): Promise<RegisterPJApiData>;
  forgotPassword(data: ForgotPasswordApiRequest): Promise<ForgotPasswordApiData>;
  me(accessToken: string): Promise<ApiUser>;
  logout(): Promise<void>;
}
