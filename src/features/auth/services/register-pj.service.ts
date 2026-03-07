/**
 * Serviço de cadastro de Pessoa Jurídica.
 * Orquestra: mapper → API.
 */

import { registerPJApi } from "../api/auth.api";
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
    const apiRequest = mapRegisterPJToApiRequest(data);
    const apiData = await registerPJApi(apiRequest);
    return {
      userId: apiData.userId,
      tipoConta: apiData.tipoConta,
      onboardingStatus: apiData.onboardingStatus,
      nextStep: apiData.nextStep,
    };
  },
};
