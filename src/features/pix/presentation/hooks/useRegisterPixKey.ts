import { useState } from "react";
import { PixKeyType } from "../../domain/models/PixKey";
import { registerPixKeyUseCase } from "../../useCases/registerPixKeyUseCase";
import { onlyNumbers } from "../../utils/masks";

/**
 * ------------------------------------------------------------------
 * Hook: useRegisterPixKey
 * ------------------------------------------------------------------
 *
 * Objetivo
 * ------------------------------------------------------------------
 * Hook responsável por orquestrar o processo de registro de uma
 * chave Pix na camada de apresentação.
 *
 * Ele centraliza:
 * - Controle de estado assíncrono
 * - Chamada do UseCase
 * - Tratamento de erro
 * - Controle de feedback visual (loading e sucesso)
 * - Coordenação de fechamento da UI após sucesso
 *
 *
 * Papel na Arquitetura
 * ------------------------------------------------------------------
 * Camada: Presentation (Application boundary)
 *
 * Fluxo:
 * Component → Hook → UseCase → Repository
 *
 * Este hook:
 * - NÃO conhece implementação de repositório
 * - NÃO contém regra de negócio complexa
 * - NÃO manipula UI diretamente
 *
 * Ele apenas coordena estados e delega execução ao UseCase.
 *
 *
 * Responsabilidades
 * ------------------------------------------------------------------
 * - Prevenir múltiplas execuções simultâneas
 * - Sanitizar input quando necessário (cpf e phone)
 * - Executar registerPixKeyUseCase
 * - Garantir tempo mínimo de loading (UX controlada)
 * - Controlar estados:
 *     loading
 *     success
 *     error
 * - Executar callbacks após sucesso:
 *     onClose
 *     onSuccess
 *
 *
 * Decisões Técnicas
 * ------------------------------------------------------------------
 * 1. Sanitização antes do UseCase
 *    O hook remove máscara de CPF e telefone usando onlyNumbers
 *    antes de enviar para a camada de negócio.
 *
 * 2. Tempo mínimo de loading (800ms)
 *    Evita flicker visual quando a resposta é muito rápida,
 *    garantindo percepção consistente de processamento.
 *
 * 3. Delay após sucesso (1000ms)
 *    Permite exibir estado visual de sucesso antes de fechar.
 *
 *
 * Tratamento de Erro
 * ------------------------------------------------------------------
 * Captura erro lançado pelo UseCase e:
 * - Prioriza err.message
 * - Fallback para mensagem padrão
 *
 *
 * Melhorias Futuras
 * ------------------------------------------------------------------
 * - Extrair controle de delay mínimo para util reutilizável
 * - Criar enum para estados (idle | loading | success | error)
 * - Implementar cancelamento seguro se componente desmontar
 *
 *
 * Parâmetros
 * ------------------------------------------------------------------
 * @param type       Tipo da chave Pix
 * @param onSuccess  Callback executado após sucesso confirmado
 * @param onClose    Callback executado para fechar o BottomSheet
 *
 *
 * Retorno
 * ------------------------------------------------------------------
 * @returns {
 *   loading: boolean
 *   success: boolean
 *   error: string | null
 *   register: (value: string) => Promise<void>
 * }
 *
 * ------------------------------------------------------------------
 */
export function useRegisterPixKey(
  type: PixKeyType,
  onSuccess: () => void,
  onClose: () => void,
) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function register(value: string) {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      let finalValue = value;

      if (type === "cpf" || type === "phone") {
        finalValue = onlyNumbers(value);
      }

      const startTime = Date.now();

      await registerPixKeyUseCase(type, finalValue);

      const elapsed = Date.now() - startTime;
      const remaining = 800 - elapsed;

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      setSuccess(true);

      setTimeout(() => {
        onClose();
        onSuccess();
      }, 1000);
    } catch (err: any) {
      setError(err.message ?? "Erro ao cadastrar chave");
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    success,
    error,
    register,
  };
}
