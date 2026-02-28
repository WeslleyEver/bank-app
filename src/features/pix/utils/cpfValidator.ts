export function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11) return false;

  //  Bloqueia sequências iguais
  if (/^(\d)\1+$/.test(cleaned)) return false;

  const digits = cleaned.split("").map(Number);

  //  Primeiro dígito verificador
  let sum1 = 0;
  for (let i = 0; i < 9; i++) {
    sum1 += digits[i] * (10 - i);
  }

  let remainder1 = (sum1 * 10) % 11;
  if (remainder1 === 10) remainder1 = 0;

  if (remainder1 !== digits[9]) return false;

  //  Segundo dígito verificador
  let sum2 = 0;
  for (let i = 0; i < 10; i++) {
    sum2 += digits[i] * (11 - i);
  }

  let remainder2 = (sum2 * 10) % 11;
  if (remainder2 === 10) remainder2 = 0;

  if (remainder2 !== digits[10]) return false;

  return true;
}