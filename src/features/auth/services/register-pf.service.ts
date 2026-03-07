/**
 * Serviço de cadastro de Pessoa Física.
 * Orquestra: mapper → datasource.
 */

import { authDataSourceFactory } from "../data/datasources/authDataSourceFactory";
import { mapRegisterPFToApiRequest } from "../mappers/auth.mapper";
import type { RegisterPFRequest } from "../types/register-pf.types";
import type { OnboardingStatus } from "../types/onboarding-status.types";

export interface RegisterPFResult {
  userId: string;
  tipoConta: "PF";
  onboardingStatus: OnboardingStatus;
  nextStep: string;
}

export const registerPFService = {
  async execute(data: RegisterPFRequest): Promise<RegisterPFResult> {
    const dataSource = authDataSourceFactory();
    const apiRequest = mapRegisterPFToApiRequest(data);
    const apiData = await dataSource.registerPF(apiRequest);
    return {
      userId: apiData.userId,
      tipoConta: apiData.tipoConta,
      onboardingStatus: apiData.onboardingStatus,
      nextStep: apiData.nextStep,
    };
  },
};
