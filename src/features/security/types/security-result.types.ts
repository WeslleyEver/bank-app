/**
 * Resultados tipados do challenge transacional.
 * Estados fechados da autorização transacional.
 */

import type { SecurityMethod } from "./security.types";
import type { SecurityErrorCodeType } from "../errors";

/**
 * Status oficiais do resultado do challenge.
 * - authorized: operação pode prosseguir
 * - cancelled: usuário desistiu/fechou
 * - denied: credencial inválida (PIN errado)
 * - blocked: bloqueio temporário ativo
 * - not_configured: sem PIN configurado
 * - unavailable: indisponível (erro técnico, mecanismo indisponível)
 */
export type SecurityChallengeStatus =
  | "authorized"
  | "cancelled"
  | "denied"
  | "blocked"
  | "not_configured"
  | "unavailable";

/** Resultado com autorização — operação pode prosseguir */
export interface AuthorizedResult {
  status: "authorized";
  method: SecurityMethod;
}

/** Resultado cancelado pelo usuário */
export interface CancelledResult {
  status: "cancelled";
}

/** Resultado negado — credencial inválida */
export interface DeniedResult {
  status: "denied";
  errorCode: SecurityErrorCodeType;
}

/** Resultado bloqueado — bloqueio temporário ativo */
export interface BlockedResult {
  status: "blocked";
  /** Timestamp ISO até quando o bloqueio está ativo */
  until: string;
}

/** Resultado sem credencial configurada */
export interface NotConfiguredResult {
  status: "not_configured";
}

/** Resultado indisponível — erro técnico ou mecanismo indisponível */
export interface UnavailableResult {
  status: "unavailable";
  reason?: string;
  errorCode?: SecurityErrorCodeType;
}

/**
 * Resultado do challenge transacional.
 * O feature chamador recebe autorização, não detalhes internos do PIN.
 */
export type SecurityChallengeResult =
  | AuthorizedResult
  | CancelledResult
  | DeniedResult
  | BlockedResult
  | NotConfiguredResult
  | UnavailableResult;
