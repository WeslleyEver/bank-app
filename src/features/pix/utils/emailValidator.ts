const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email: string): boolean {
  if (!email) return false;

  const normalized = email.trim().toLowerCase();

  // Estrutura básica inválida
  if (!EMAIL_REGEX.test(normalized)) return false;

  const [localPart, domain] = normalized.split("@");

  if (!localPart || !domain) return false;

  // Não pode começar ou terminar com ponto
  if (localPart.startsWith(".") || localPart.endsWith(".")) return false;

  // Não pode ter dois pontos seguidos
  if (localPart.includes("..")) return false;

  // Domínio precisa ter pelo menos um ponto
  if (!domain.includes(".")) return false;

  const domainParts = domain.split(".");

  // TLD precisa ter pelo menos 2 letras
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) return false;

  return true;
}
