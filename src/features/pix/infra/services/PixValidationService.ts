export type PixKeyType = "cpf" | "email" | "phone" | "random" | null;

export class PixValidationService {
  static detectKeyType(value: string): PixKeyType {
    if (this.isValidCPF(value)) return "cpf";
    if (this.isValidEmail(value)) return "email";
    if (this.isValidPhone(value)) return "phone";
    if (this.isRandomKey(value)) return "random";

    return null;
  }

  private static isValidCPF(value: string): boolean {
    const cpf = value.replace(/\D/g, "");
    return cpf.length === 11;
  }

  private static isValidEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  private static isValidPhone(value: string): boolean {
    const phone = value.replace(/\D/g, "");
    return phone.length === 11;
  }

  private static isRandomKey(value: string): boolean {
    return value.length >= 32;
  }
}
