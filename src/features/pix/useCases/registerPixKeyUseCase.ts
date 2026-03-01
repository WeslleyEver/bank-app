import * as Crypto from "expo-crypto";
import { PixKey } from "../domain/models/PixKey";
import { pixRepository } from "../infra/pix.repository";
import { PixValidationService } from "../services/PixValidationService";
import { usePixStore } from "../store/pix.store";
import { normalizePixValue } from "../utils/normalizers";

/**
 * ------------------------------------------------------------------
 * Use Case: registerPixKeyUseCase
 * ------------------------------------------------------------------
 *
 * Objetivo
 * ------------------------------------------------------------------
 * Orquestrar o fluxo completo de registro de uma nova chave Pix,
 * garantindo que todas as regras de negócio sejam aplicadas antes
 * da persistência e da atualização de estado.
 *
 *
 * Papel na Arquitetura
 * ------------------------------------------------------------------
 * Camada: Application
 *
 * Fluxo:
 * UI → Hook → UseCase → Repository → Store
 *
 * Este caso de uso:
 * - NÃO contém lógica de UI
 * - NÃO conhece detalhes de implementação do repositório
 * - NÃO executa validações diretamente (delegadas ao serviço)
 *
 * Ele apenas coordena dependências e garante a ordem correta
 * de execução do fluxo.
 *
 *
 * Responsabilidades
 * ------------------------------------------------------------------
 * 1. Obter estado atual das chaves cadastradas
 * 2. Normalizar o valor informado
 * 3. Executar validações de regra de negócio
 * 4. Criar entidade PixKey válida
 * 5. Persistir via repositório
 * 6. Atualizar estado global após sucesso
 *
 *
 * Dependências
 * ------------------------------------------------------------------
 * - usePixStore (estado global)
 * - normalizePixValue (sanitização e padronização)
 * - PixValidationService (regras de negócio)
 * - pixRepository (persistência)
 * - expo-crypto (geração de identificador)
 *
 *
 * Regras Importantes
 * ------------------------------------------------------------------
 * • Nenhuma chave inválida pode ser persistida.
 * • Nenhuma chave duplicada pode ser criada.
 * • Toda chave criada deve possuir:
 *     - id único
 *     - valor normalizado
 *     - data de criação
 *
 *
 * Decisões Técnicas
 * ------------------------------------------------------------------
 *
 * 1. Normalização antes da validação
 *    Garante que regras sejam aplicadas sobre dados padronizados.
 *
 * 2. Validação isolada em Service
 *    Mantém regras de negócio fora do UseCase.
 *
 * 3. Store atualizada somente após persistência
 *    Evita inconsistência entre estado local e repositório.
 *
 * 4. UUID gerado na camada de Application
 *    Mantém independência do repositório.
 *
 *
 * Tratamento de Erro
 * ------------------------------------------------------------------
 * Se a validação falhar, é lançada exceção com mensagem
 * proveniente do PixValidationService.
 *
 * O tratamento da mensagem é responsabilidade da camada superior.
 *
 *
 * Parâmetros
 * ------------------------------------------------------------------
 * @param type        Tipo da chave (cpf | phone | email | random)
 * @param value       Valor informado pelo usuário
 * @param accountType Tipo de conta (PF | PJ). Default: PF
 *
 *
 * Retorno
 * ------------------------------------------------------------------
 * @returns Promise<PixKey>
 *
 * Retorna a chave criada após persistência bem-sucedida.
 *
 * ------------------------------------------------------------------
 */
export async function registerPixKeyUseCase(
  type: PixKey["type"],
  value: string,
  accountType: "PF" | "PJ" = "PF",
): Promise<PixKey> {
  /**
   * 1. Obtém lista atual de chaves do estado global.
   */
  const { keys } = usePixStore.getState();

  /**
   * 2. Normaliza o valor antes de validação e persistência.
   */
  const normalizedValue = normalizePixValue(type, value);

  /**
   * 3. Executa validação de regras de negócio.
   */
  const validation = PixValidationService.validate(
    type,
    normalizedValue,
    keys,
    accountType,
  );

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  /**
   * 4. Cria objeto definitivo da chave Pix.
   */
  const newKey: PixKey = {
    id: Crypto.randomUUID(),
    type,
    value: normalizedValue,
    createdAt: new Date(),
  };

  /**
   * 5. Persiste a chave através do repositório.
   */
  const savedKey = await pixRepository.register(newKey);

  /**
   * 6. Atualiza estado global após persistência bem-sucedida.
   */
  usePixStore.getState().addKey(savedKey);

  return savedKey;
}
