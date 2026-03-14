/**
 * Tipos do fluxo de criação/configuração de PIN.
 */

import type { SecurityErrorCodeType } from "../errors";

/** Entrada do setup de PIN — contrato tipado e semântico */
export interface SetupPinInput {
  pin: string;
  confirmation: string;
  accountId: string;
}

/** Resultado do setup de PIN */
export type SetupPinResult =
  | { success: true }
  | { success: false; errorCode: SecurityErrorCodeType };
