/**
 * Cenários de mock controlados por documento/cpf.
 */

import type { ApiUser } from "../../api/auth.api.types";
import type { OnboardingStatus } from "../../types/onboarding-status.types";

const MOCK_PASSWORD = "123456";

export interface MockScenario {
  documento: string;
  nome: string;
  email: string;
  tipoConta: "PF" | "PJ";
  onboardingStatus: OnboardingStatus;
  senha: string;
}

export const MOCK_SCENARIOS: Record<string, MockScenario> = {
  "11111111111": {
    documento: "11111111111",
    nome: "Usuário Aprovado",
    email: "aprovado@mock.com",
    tipoConta: "PF",
    onboardingStatus: "aprovado",
    senha: MOCK_PASSWORD,
  },
  "22222222222": {
    documento: "22222222222",
    nome: "Usuário Pendente",
    email: "pendente@mock.com",
    tipoConta: "PF",
    onboardingStatus: "pendente",
    senha: MOCK_PASSWORD,
  },
  "33333333333": {
    documento: "33333333333",
    nome: "Usuário Em Análise",
    email: "emanalise@mock.com",
    tipoConta: "PF",
    onboardingStatus: "em_analise",
    senha: MOCK_PASSWORD,
  },
  "44444444444": {
    documento: "44444444444",
    nome: "Usuário Documentos Pendentes",
    email: "docpendentes@mock.com",
    tipoConta: "PF",
    onboardingStatus: "documentos_pendentes",
    senha: MOCK_PASSWORD,
  },
  "55555555555": {
    documento: "55555555555",
    nome: "Usuário Rejeitado",
    email: "rejeitado@mock.com",
    tipoConta: "PF",
    onboardingStatus: "rejeitado",
    senha: MOCK_PASSWORD,
  },
  "77777777777": {
    documento: "77777777777",
    nome: "Usuário Sessão Expirada",
    email: "expirado@mock.com",
    tipoConta: "PF",
    onboardingStatus: "aprovado",
    senha: MOCK_PASSWORD,
  },
};

export function getMockScenarioByDocumento(documento: string): MockScenario | null {
  const cleaned = documento.replace(/\D/g, "");
  return MOCK_SCENARIOS[cleaned] ?? null;
}

export function scenarioToApiUser(
  scenario: MockScenario,
  userId: string = `mock-user-${scenario.documento}`
): ApiUser {
  return {
    id: userId,
    nome: scenario.nome,
    email: scenario.email,
    documento: scenario.documento,
    tipoConta: scenario.tipoConta,
    onboardingStatus: scenario.onboardingStatus,
  };
}
