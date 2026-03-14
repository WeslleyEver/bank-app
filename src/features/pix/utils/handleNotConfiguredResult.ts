/**
 * Handler para resultado not_configured do challenge.
 * Encaminha o usuário ao fluxo oficial de setup de PIN (SECURITY).
 * Permite testar a intenção de navegação.
 */

import { PIN_SETUP_ROUTE } from "@/constants/navigation";

export type RouterLike = {
  push: (href: string) => void;
};

/**
 * Dispara navegação para a tela de setup de PIN quando o challenge retorna not_configured.
 */
export function navigateToPinSetup(router: RouterLike): void {
  router.push(PIN_SETUP_ROUTE);
}
