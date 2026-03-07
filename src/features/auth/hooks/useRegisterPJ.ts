/**
 * Hook de cadastro de Pessoa Jurídica.
 * Controla estado da tela e chama registerPJService.
 */

import { useCallback, useState } from "react";
import { Href, useRouter } from "expo-router";
import { registerPJService } from "../services/register-pj.service";
import type { RegisterPJRequest } from "../types/register-pj.types";
import { AUTH_MESSAGES } from "../constants";

export function useRegisterPJ() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (data: RegisterPJRequest) => {
      setIsSubmitting(true);
      setError(null);
      try {
        await registerPJService.execute(data);
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
