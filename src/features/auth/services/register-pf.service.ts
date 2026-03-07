/**
 * Serviço de cadastro de Pessoa Física.
 * Orquestra: mapper → API.
 */

import { registerPFApi } from "../api/auth.api";
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
    const apiRequest = mapRegisterPFToApiRequest(data);
    const apiData = await registerPFApi(apiRequest);
    return {
      userId: apiData.userId,
      tipoConta: apiData.tipoConta,
      onboardingStatus: apiData.onboardingStatus,
      nextStep: apiData.nextStep,
    };
  },
};
