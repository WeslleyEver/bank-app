/**
 * Hook de recuperação de senha.
 * Controla estado da tela e chama forgotPasswordService.
 */

import { useCallback, useState } from "react";
import { forgotPasswordService } from "../services/forgot-password.service";
import type { ForgotPasswordRequest } from "../types/forgot-password.types";
import { AUTH_MESSAGES } from "../constants";

export function useForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (data: ForgotPasswordRequest) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await forgotPasswordService.execute(data);
      setSuccess(true);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : AUTH_MESSAGES.FORGOT_PASSWORD_ERROR;
      setError(msg);
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submit, isSubmitting, error, success };
}
