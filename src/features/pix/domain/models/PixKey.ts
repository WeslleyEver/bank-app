/**
 * ------------------------------------------------------------------
 * Domain: PixKey Types
 * ------------------------------------------------------------------
 *
 * Este arquivo define os contratos centrais do domínio
 * relacionados às chaves Pix.
 *
 * Ele representa a camada de domínio (Domain Layer),
 * independente de:
 * - UI
 * - Store
 * - API
 * - Banco de dados
 *
 * Qualquer alteração aqui impacta diretamente
 * as regras de negócio do sistema.
 * ------------------------------------------------------------------
 */

/**
 * Define os tipos de chaves Pix permitidos pelo sistema.
 *
 * Esses valores representam as categorias oficiais
 * aceitas para registro de chave.
 *
 * @typedef {("phone" | "email" | "cpf" | "random")} PixKeyType
 *
 * @remarks
 * - "phone"  → Número de telefone
 * - "email"  → Endereço de e-mail
 * - "cpf"    → Documento CPF
 * - "random" → Chave aleatória gerada pelo sistema
 *
 * Em um backend real, esses valores devem estar
 * alinhados com o contrato oficial da API.
 */
export type PixKeyType = "phone" | "email" | "cpf" | "random";

/**
 * ------------------------------------------------------------------
 * Entity: PixKey
 * ------------------------------------------------------------------
 *
 * Representa uma chave Pix vinculada a uma conta.
 *
 * Esta é uma entidade de domínio.
 * Ela não contém lógica de UI ou persistência,
 * apenas estrutura de dados e significado de negócio.
 *
 * @interface PixKey
 */
export interface PixKey {
  /**
   * Identificador único da chave.
   *
   * Pode ser:
   * - UUID
   * - ULID
   * - ID gerado pelo backend
   */
  id: string;

  /**
   * Categoria da chave.
   *
   * Deve corresponder a um dos valores definidos
   * em {@link PixKeyType}.
   */
  type: PixKeyType;

  /**
   * Valor da chave Pix.
   *
   * Exemplos:
   * - Telefone: "+5511999999999"
   * - Email: "user@email.com"
   * - CPF: "12345678900"
   * - Random: "8f4d2c9e-..."
   *
   * ⚠️ Validações de formato devem ser feitas
   * no UseCase ou backend.
   */
  value: string;

  /**
   * Data e hora de criação da chave.
   *
   * Armazenado como objeto Date no domínio.
   *
   * Em integração com API, normalmente será
   * recebido como string ISO e convertido.
   */
  createdAt: Date;
}