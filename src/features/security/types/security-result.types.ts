/**
 * Tipos de resultado do challenge transacional.
 * Placeholder arquitetural — implementação funcional nas tasks 7–8.
 */

/** Resultado do challenge transacional */
export type SecurityChallengeResult =
  | { status: "authorized"; method: "PIN" }
  | { status: "cancelled" }
  | { status: "denied"; errorCode?: string }
  | { status: "blocked"; until: string }
  | { status: "not_configured" }
  | { status: "unavailable"; reason?: string }
  | { status: "error"; errorCode?: string };
