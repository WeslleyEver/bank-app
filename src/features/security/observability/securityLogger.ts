/**
 * Logger de observabilidade da feature SECURITY.
 * NUNCA loga: PIN, confirmação, hash, salt, material persistido, payload sensível.
 */

import type {
  SecurityErrorCodeType,
  SecurityErrorCategory,
} from "../errors";

export type SecurityEventType =
  | "challenge_started"
  | "challenge_authorized"
  | "challenge_denied"
  | "challenge_blocked"
  | "challenge_cancelled"
  | "challenge_not_configured"
  | "challenge_unavailable"
  | "pin_setup_success"
  | "pin_setup_failed"
  | "validation_invalid"
  | "validation_block_activated"
  | "storage_read_failed"
  | "storage_write_failed"
  | "storage_data_invalid"
  | "validation_execution_failed";

export type SecurityLogLevel = "info" | "warn" | "error";

export interface SecurityLogContext {
  /** Tipo da operação (ex: pix_transfer) — sanitizado */
  operation?: string;
  /** Código de erro quando aplicável */
  code?: SecurityErrorCodeType;
  /** Categoria do erro */
  category?: SecurityErrorCategory;
  /** Número de tentativa (quando seguro) */
  attemptNumber?: number;
  /** Tentativas restantes */
  remainingAttempts?: number;
  /** Duração do bloqueio em ms */
  blockDurationMs?: number;
  /** PIN configurado para conta (boolean) — NUNCA o valor */
  hasConfiguredPin?: boolean;
  /** Contexto adicional — NUNCA dados sensíveis */
  [key: string]: string | number | boolean | undefined;
}

type LogFn = (level: SecurityLogLevel, event: SecurityEventType, context?: SecurityLogContext) => void;

let logImpl: LogFn = (_level, event, context) => {
  if (__DEV__) {
    const safe = JSON.stringify({ event, ...context });
    // eslint-disable-next-line no-console
    console.log(`[SECURITY] ${safe}`);
  }
};

/**
 * Configura a implementação de log (para testes ou integração com vendor).
 */
export function setSecurityLogger(fn: LogFn): void {
  logImpl = fn;
}

/**
 * Restaura o logger padrão.
 */
export function resetSecurityLogger(): void {
  logImpl = (_level, event, context) => {
    if (__DEV__) {
      const safe = JSON.stringify({ event, ...context });
      // eslint-disable-next-line no-console
      console.log(`[SECURITY] ${safe}`);
    }
  };
}

/**
 * Registra evento de segurança. Contexto deve conter APENAS dados seguros.
 */
export function logSecurityEvent(
  event: SecurityEventType,
  context?: SecurityLogContext,
  level: SecurityLogLevel = "info"
): void {
  logImpl(level, event, context);
}
