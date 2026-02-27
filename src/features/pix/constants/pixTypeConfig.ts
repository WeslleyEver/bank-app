import { Ionicons } from "@expo/vector-icons";
import { PixKeyType } from "../domain/models/PixKey";

/**
  * Gera o icone docarde da chave que o usuario cadastra
  */
export const PIX_TYPE_CONFIG: Record<
  PixKeyType,
  { label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  phone: {
    label: "Celular",
    icon: "phone-portrait-outline",
  },
  email: {
    label: "Email",
    icon: "mail-outline",
  },
  cpf: {
    label: "CPF",
    icon: "id-card-outline",
  },
  random: {
    label: "Chave aleatória",
    icon: "shuffle-outline",
  },
};