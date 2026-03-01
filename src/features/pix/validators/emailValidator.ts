/**
 * Expressão regular base para validação estrutural de e-mail.
 *
 * A regex cobre:
 * - Caracteres válidos na parte local
 * - Estrutura com @ obrigatório
 * - Domínio com pelo menos um ponto
 * - TLD com no mínimo 2 caracteres
 *
 * Observação:
 * Esta regex realiza validação estrutural básica e não garante
 * existência real do endereço.
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Valida um endereço de e-mail com base em regras estruturais.
 *
 * Regras aplicadas:
 * - Verifica se o valor foi informado
 * - Normaliza removendo espaços e aplicando lowercase
 * - Valida estrutura básica via regex
 * - Impede ponto no início ou fim da parte local
 * - Impede pontos consecutivos na parte local
 * - Garante que o domínio possua pelo menos um ponto
 * - Garante que o TLD tenha ao menos 2 caracteres
 *
 * @param email - Endereço informado pelo usuário
 * @returns boolean - true se o e-mail for estruturalmente válido, false caso contrário
 *
 * Observação:
 * Esta função valida apenas a estrutura sintática do e-mail.
 * Não verifica se o domínio existe ou se o endereço está ativo.
 */
export function isValidEmail(email: string): boolean {
  /**
   * Regra 1: Campo não pode ser vazio ou indefinido.
   */
  if (!email) return false;

  /**
   * Normaliza removendo espaços e convertendo para minúsculo.
   */
  const normalized = email.trim().toLowerCase();

  /**
   * Regra 2: Validação estrutural básica via expressão regular.
   */
  if (!EMAIL_REGEX.test(normalized)) return false;

  const [localPart, domain] = normalized.split("@");

  /**
   * Regra 3: Deve conter parte local e domínio.
   */
  if (!localPart || !domain) return false;

  /**
   * Regra 4: Parte local não pode começar ou terminar com ponto.
   */
  if (localPart.startsWith(".") || localPart.endsWith(".")) return false;

  /**
   * Regra 5: Parte local não pode conter pontos consecutivos.
   */
  if (localPart.includes("..")) return false;

  /**
   * Regra 6: Domínio deve conter pelo menos um ponto.
   */
  if (!domain.includes(".")) return false;

  const domainParts = domain.split(".");

  /**
   * Regra 7: TLD deve possuir no mínimo 2 caracteres.
   */
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) return false;

  /**
   * E-mail considerado válido após validação estrutural completa.
   */
  return true;
}
