/**
 * Logger de observabilidade do módulo AUTH.
 * Rastreabilidade simples para debug e instrumentação futura.
 *
 * Regras:
 * - Nunca logar dados sensíveis (tokens, senha, documento, PIN, headers)
 * - Ativo apenas em __DEV__ ou quando AUTH_LOGGING_ENABLED = true
 * - Implementação trocável: substituir outputAdapter por analytics/telemetry
 */

const PREFIX = "[AUTH]";

/** Chaves que NUNCA devem ser logadas */
const SENSITIVE_KEYS = new Set([
  "accessToken", "refreshToken", "token", "auth", "authorization",
  "password", "senha", "pin", "documento", "cpf", "cnpj",
  "headers", "body", "data", "payload", "credentials",
]);

/** Meta permitida: apenas tipos primitivos e estruturas simples e seguras */
type SafeMeta = Record<string, string | number | boolean | null | undefined>;

function isEnabled(): boolean {
  if (typeof __DEV__ !== "undefined" && __DEV__) return true;
  if (typeof process !== "undefined" && process.env?.AUTH_LOGGING_ENABLED === "true") return true;
  return false;
}

function sanitizeMeta(meta?: Record<string, unknown>): SafeMeta {
  if (!meta || typeof meta !== "object") return {};
  const out: SafeMeta = {};
  for (const [key, value] of Object.entries(meta)) {
    const keyLower = key.toLowerCase();
    if (SENSITIVE_KEYS.has(keyLower)) continue;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null || value === undefined) {
      out[key] = value as string | number | boolean | null | undefined;
    }
  }
  return out;
}

/** Normaliza path removendo query string (evita vazamento em URLs) */
function safePath(path: string): string {
  const idx = path.indexOf("?");
  return idx >= 0 ? path.slice(0, idx) : path;
}

function format(event: string, meta?: SafeMeta): string {
  const metaStr = Object.keys(meta ?? {}).length > 0
    ? ` ${JSON.stringify(meta)}`
    : "";
  return `${PREFIX} ${event}${metaStr}`;
}

export const authLogger = {
  info(event: string, meta?: Record<string, unknown>): void {
    if (!isEnabled()) return;
    const safe = sanitizeMeta(meta);
    console.log(format(event, safe));
  },

  warn(event: string, meta?: Record<string, unknown>): void {
    if (!isEnabled()) return;
    const safe = sanitizeMeta(meta);
    console.warn(format(event, safe));
  },

  error(event: string, meta?: Record<string, unknown>): void {
    if (!isEnabled()) return;
    const safe = sanitizeMeta(meta);
    console.error(format(event, safe));
  },

  /** Utilitário para path seguro em meta (opcional) */
  safePath,
};
