import { Ionicons } from "@expo/vector-icons";
import { PixKeyType } from "../domain/models/PixKey";

/**
 * ------------------------------------------------------------------
 * Presentation Config: PIX_TYPE_CONFIG
 * ------------------------------------------------------------------
 *
 * Mapeamento de configuração visual para cada tipo de chave Pix.
 *
 * Responsabilidade:
 * - Traduzir o tipo técnico (PixKeyType)
 *   em informações de apresentação:
 *   • Label amigável
 *   • Ícone correspondente
 *
 * ⚠️ IMPORTANTE:
 * Este arquivo pertence à camada de UI.
 * Ele NÃO deve conter regra de negócio.
 * Ele NÃO deve validar dados.
 *
 * Arquitetura:
 * Domain (PixKeyType) → UI Mapping → Component
 *
 * Caso um novo tipo de chave seja adicionado no domínio,
 * o TypeScript obrigará a inclusão aqui,
 * garantindo consistência visual.
 * ------------------------------------------------------------------
 */
export const PIX_TYPE_CONFIG: Record<
  PixKeyType,
  { label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  /**
   * Telefone celular vinculado à conta.
   */
  phone: {
    label: "Celular",
    icon: "phone-portrait-outline",
  },

  /**
   * Endereço de e-mail vinculado à conta.
   */
  email: {
    label: "Email",
    icon: "mail-outline",
  },

  /**
   * Documento CPF vinculado à conta.
   */
  cpf: {
    label: "CPF",
    icon: "id-card-outline",
  },

  /**
   * Chave aleatória gerada pelo sistema.
   */
  random: {
    label: "Chave aleatória",
    icon: "shuffle-outline",
  },
};
