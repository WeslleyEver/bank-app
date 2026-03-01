import { useState } from "react";
import { deletePixKeyUseCase } from "../../useCases/deletePixKeyUseCase";

/**
 * Hook responsável por orquestrar exclusão
 * e controlar estado assíncrono.
 */
export function useDeletePixKey(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(id: string) {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      await deletePixKeyUseCase(id);

      onSuccess?.();
    } catch (err: any) {
      setError(err.message ?? "Erro ao remover chave");
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    remove,
  };
}
