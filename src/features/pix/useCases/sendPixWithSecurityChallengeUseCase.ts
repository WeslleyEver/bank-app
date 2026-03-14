/**
 * Caso de uso: Envio de Pix com challenge transacional.
 * PIX solicita autorização ao SECURITY antes de executar o envio.
 * NUNCA executa envio sem resultado authorized.
 */

import { requestTransactionalChallenge } from "@/src/features/security";
import type { SecurityChallengeResult } from "@/src/features/security";
import { sendPixUseCase } from "./sendPix.useCase";

export type SendPixProtectedInput = {
  to: string;
  amount: number;
  accountId: string;
};

export type SendPixProtectedResult =
  | { success: true }
  | { success: false; challengeResult: SecurityChallengeResult };

/**
 * Executa envio de Pix somente após autorização transacional.
 * Em authorized: chama sendPixUseCase e retorna success.
 * Em qualquer outro resultado: NÃO envia e retorna o resultado para tratamento na UI.
 */
export async function sendPixWithSecurityChallengeUseCase(
  input: SendPixProtectedInput
): Promise<SendPixProtectedResult> {
  const { to, amount, accountId } = input;

  const challengeResult = await requestTransactionalChallenge({
    type: "PIX_TRANSFER",
    accountId,
    metadata: { to, amount },
  });

  if (challengeResult.status !== "authorized") {
    return { success: false, challengeResult };
  }

  await sendPixUseCase(to, amount);
  return { success: true };
}
