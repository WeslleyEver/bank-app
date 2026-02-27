/**
 * Define os tipos de chaves Pix permitidos pelo sistema.
 *
 * @typedef {("phone"|"email"|"cpf"|"random")} PixKeyType
 */
export type PixKeyType = "phone" | "email" | "cpf" | "random";

/**
 * Representa uma chave Pix vinculada a uma conta.
 *
 * @interface PixKey
 */
export interface PixKey {
  /** Identificador único da chave (UUID/ULID) */
  id: string;

  /** Categoria da chave definida em {@link PixKeyType} */
  type: PixKeyType;

  /** O valor da chave (ex: número do telefone, e-mail ou documento) */
  value: string;

  /** Data e hora em que a chave foi registrada */
  createdAt: Date;
}
