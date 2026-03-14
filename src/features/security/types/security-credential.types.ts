/**
 * Tipos de credencial transacional.
 * Define o conceito de credencial, método e status de configuração.
 */

import type { SecurityMethod } from "./security.types";

/**
 * Método de credencial transacional.
 * v1 = PIN; futuramente biometria e OTP.
 */
export type TransactionalCredentialMethod = SecurityMethod;

/**
 * Status da configuração da credencial transacional.
 * - configured: material seguro persistido e válido (hash, salt, metadados)
 * - not_configured: sem material válido
 * - blocked: bloqueio temporário ativo
 * - unavailable: indisponível temporariamente (ex: erro técnico)
 */
export type CredentialConfigurationStatus =
  | "configured"
  | "not_configured"
  | "blocked"
  | "unavailable";

/**
 * Status da credencial transacional para uso no fluxo.
 * Usuário com PIN configurado: status = configured.
 * Usuário sem PIN configurado: status = not_configured.
 * Bloqueio ativo: status = blocked.
 */
export type SecurityCredentialStatus = CredentialConfigurationStatus;

/**
 * Usuário com PIN configurado:
 * - existe material seguro persistido e válido (hash, salt, versão, metadados)
 * - a presença de um booleano em memória NÃO é suficiente
 * - a verificação real depende de persistência (TASK 3+)
 *
 * Usuário sem PIN configurado:
 * - não existe material válido
 * - challenge deve retornar not_configured
 */
export type UserWithPinStatus = "has_pin" | "no_pin";
