/**
 * Serviço de recuperação de senha.
 * Usa documento (CPF ou CNPJ).
 */

import { forgotPasswordApi } from "../api/auth.api";
import type { ForgotPasswordRequest } from "../types/forgot-password.types";

export interface ForgotPasswordResult {
  message: string;
}

export const forgotPasswordService = {
  async execute(data: ForgotPasswordRequest): Promise<ForgotPasswordResult> {
    const apiData = await forgotPasswordApi({ documento: data.documento });
    return { message: apiData.message };
  },
};
