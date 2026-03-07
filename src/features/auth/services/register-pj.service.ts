/**
 * Serviço de cadastro de Pessoa Jurídica.
 * Orquestra: mapper → datasource.
 */

import { authDataSourceFactory } from "../data/datasources/authDataSourceFactory";
import { mapRegisterPJToApiRequest } from "../mappers/auth.mapper";
import type { RegisterPJRequest } from "../types/register-pj.types";
import type { OnboardingStatus } from "../types/onboarding-status.types";

export interface RegisterPJResult {
  userId: string;
  tipoConta: "PJ";
  onboardingStatus: OnboardingStatus;
  nextStep: string;
}

export const registerPJService = {
  async execute(data: RegisterPJRequest): Promise<RegisterPJResult> {
    const dataSource = authDataSourceFactory();
    const apiRequest = mapRegisterPJToApiRequest(data);
    const apiData = await dataSource.registerPJ(apiRequest);
    return {
      userId: apiData.userId,
      tipoConta: apiData.tipoConta,
      onboardingStatus: apiData.onboardingStatus,
      nextStep: apiData.nextStep,
    };
  },
};
