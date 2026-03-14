/**
 * Tipos da store SECURITY.
 * Payloads seguros — nunca incluem hash, salt ou PIN.
 */

import type { SecurityErrorCodeType } from "../errors";

/**
 * Payload para hidratação da store a partir da persistência.
 * Contém apenas dados derivados — nunca hash, salt ou PIN.
 */
export interface SecurityHydratePayload {
  hasPin: boolean;
  failedAttempts: number;
  isBlocked: boolean;
  blockUntil: string | null;
}
