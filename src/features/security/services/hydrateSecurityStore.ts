/**
 * Hidrata a store SECURITY a partir da persistência segura.
 * Lê material via gateway, deriva apenas estado operacional, atualiza a store.
 * NUNCA coloca hash, salt ou PIN na store.
 */

import { readPinMaterial } from "../infra/pinStorage";
import { useSecurityStore } from "../store/security.store";

/**
 * Lê material persistido, deriva estado seguro e atualiza a store.
 */
export async function hydrateSecurityStore(accountId: string): Promise<void> {
  const result = await readPinMaterial(accountId);

  if (!result.success) {
    return;
  }

  if (result.data === null) {
    useSecurityStore.getState().hydrateFromPersistence({
      hasPin: false,
      failedAttempts: 0,
      isBlocked: false,
      blockUntil: null,
    });
    return;
  }

  const { metadata } = result.data;
  const now = new Date();
  const blockUntil = metadata.blockUntil;
  const isBlocked =
    blockUntil !== null && new Date(blockUntil) > now;

  useSecurityStore.getState().hydrateFromPersistence({
    hasPin: true,
    failedAttempts: metadata.failedAttempts,
    isBlocked,
    blockUntil,
  });
}
