/**
 * Serviço de recuperação de senha.
 * Usa documento (CPF ou CNPJ).
 */

import { authDataSourceFactory } from "../data/datasources/authDataSourceFactory";
import type { ForgotPasswordRequest } from "../types/forgot-password.types";

export interface ForgotPasswordResult {
  message: string;
}

export const forgotPasswordService = {
  async execute(data: ForgotPasswordRequest): Promise<ForgotPasswordResult> {
    const dataSource = authDataSourceFactory();
    const apiData = await dataSource.forgotPassword({ documento: data.documento });
    return { message: apiData.message };
  },
};
