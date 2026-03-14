/**
 * Limpa estado da feature SECURITY.
 *
 * Comportamento (v1):
 * - accountId informado: remove material de PIN da conta (troca de conta, reset futuro).
 * - clearLocalStore: reseta estado local da store (não remove persistência).
 * - Logout: NÃO limpa PIN por padrão (SECURITY_CLEANUP_POLICY.LOGOUT_CLEARS_PIN).
 * - Troca de conta: passar accountId da conta que está saindo e clearLocalStore=true.
 */

import { clearPinMaterial } from "../infra/pinStorage";
import { useSecurityStore } from "../store";

export interface ClearSecurityStateOptions {
  /** ID da conta para limpar material de PIN (troca de conta, reset futuro) */
  accountId?: string;
  /** Reseta estado local da store (recomendado em troca de conta) */
  clearLocalStore?: boolean;
}

export async function clearSecurityState(
  options?: ClearSecurityStateOptions
): Promise<void> {
  if (options?.accountId) {
    await clearPinMaterial(options.accountId);
  }
  if (options?.clearLocalStore) {
    useSecurityStore.getState().resetLocalState();
  }
}
