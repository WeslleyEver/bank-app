import { PixKeyType } from "../domain/models/PixKey";
import { onlyNumbers } from "./masks";

export function normalizePixValue(type: PixKeyType, value: string) {
  switch (type) {
    case "cpf":
    case "phone":
      return onlyNumbers(value);

    case "email":
      return value.trim().toLowerCase();

    default:
      return value;
  }
}