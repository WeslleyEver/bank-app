/**
 * Tipos do fluxo de validação de PIN.
 * Distingue claramente: validated, invalid, blocked, not_configured, cancelled, unavailable.
 */

import type { SecurityErrorCodeType } from "../errors";

/** Entrada da validação de PIN */
export interface ValidatePinInput {
  pin: string;
  accountId: string;
}

/** Status da validação de PIN */
export type ValidatePinStatus =
  | "validated"
  | "invalid"
  | "blocked"
  | "not_configured"
  | "cancelled"
  | "unavailable";

/** Resultado tipado da validação de PIN */
export type ValidatePinResult =
  | { status: "validated" }
  | { status: "invalid"; errorCode: SecurityErrorCodeType; remainingAttempts?: number }
  | { status: "blocked"; blockUntil: string; errorCode: SecurityErrorCodeType }
  | { status: "not_configured"; errorCode: SecurityErrorCodeType }
  | { status: "cancelled" }
  | { status: "unavailable"; errorCode: SecurityErrorCodeType };
