/**
 * Factory centralizado para escolher entre backend real e mock.
 */

import { USE_AUTH_MOCKS } from "../../constants/auth-mock.constants";
import type { AuthDataSource } from "./AuthDataSource";
import { backendAuthDataSource } from "./backendAuthDataSource";
import { mockAuthDataSource } from "./mockAuthDataSource";

let _instance: AuthDataSource | null = null;

export function authDataSourceFactory(): AuthDataSource {
  if (!_instance) {
    _instance = USE_AUTH_MOCKS ? mockAuthDataSource : backendAuthDataSource;
  }
  return _instance;
}
