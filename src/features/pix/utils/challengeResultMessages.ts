/**
 * Mapeamento de resultados do challenge SECURITY para mensagens de UI do Pix.
 * Pix não conhece detalhes internos — apenas o resultado tipado.
 */

import type { SecurityChallengeResult } from "@/src/features/security";

export function getChallengeResultMessage(result: SecurityChallengeResult): string {
  switch (result.status) {
    case "authorized":
      return "";
    case "denied":
      return "PIN incorreto. Tente novamente.";
    case "blocked":
      return "PIN bloqueado temporariamente. Tente mais tarde.";
    case "not_configured":
      return "Configure seu PIN antes de enviar Pix.";
    case "cancelled":
      return "Operação cancelada.";
    case "unavailable":
      return "Não foi possível verificar. Tente novamente.";
    default:
      return "Ocorreu um erro. Tente novamente.";
  }
}
