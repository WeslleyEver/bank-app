/**
 * Hook de cadastro de Pessoa Física.
 * Controla estado da tela e chama registerPFService.
 */

import { useCallback, useState } from "react";
import { Href, useRouter } from "expo-router";
import { registerPFService } from "../services/register-pf.service";
import type { RegisterPFRequest } from "../types/register-pf.types";
import { AUTH_MESSAGES } from "../constants";

export function useRegisterPF() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (data: RegisterPFRequest) => {
      setIsSubmitting(true);
      setError(null);
      try {
        await registerPFService.execute(data);
        router.replace("/auth/login" as Href);
      } catch (e) {
        const msg = e instanceof Error ? e.message : AUTH_MESSAGES.REGISTER_ERROR;
        setError(msg);
        throw e;
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  return { register, isSubmitting, error };
}
