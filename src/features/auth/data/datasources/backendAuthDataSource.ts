/**
 * Data source que encapsula chamadas reais ao backend.
 */

import {
  loginApi,
  registerPFApi,
  registerPJApi,
  forgotPasswordApi,
  meApi,
} from "../../api/auth.api";
import type { AuthDataSource } from "./AuthDataSource";

export const backendAuthDataSource: AuthDataSource = {
  login: loginApi,
  registerPF: registerPFApi,
  registerPJ: registerPJApi,
  forgotPassword: forgotPasswordApi,
  me: meApi,
  logout: async () => {},
};
