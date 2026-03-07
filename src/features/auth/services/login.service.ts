/**
 * Serviço de login.
 * Orquestra: API → mapper → session service → retorno.
 */

import { loginApi } from "../api/auth.api";
import { mapLoginDataToSession } from "../mappers/session.mapper";
import { sessionService } from "./session.service";
import type { LoginRequest } from "../types/login.types";
import type { AuthSession } from "../types/auth-session.types";

export const loginService = {
  async execute(data: LoginRequest): Promise<AuthSession> {
    const apiData = await loginApi({
      documento: data.documento,
      senha: data.senha,
    });
    const session = mapLoginDataToSession(apiData);
    await sessionService.persistSession(session);
    return session;
  },
};
