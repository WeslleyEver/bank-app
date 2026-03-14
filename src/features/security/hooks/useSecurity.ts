/**
 * Hook de consumo da feature SECURITY.
 * Expõe estado estrutural mínimo.
 */

import { useSecurityStore } from "../store";

export function useSecurity() {
  return useSecurityStore();
}
