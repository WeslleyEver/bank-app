import { COLORS } from "@/src/theme/colors";
import { SHADOWS } from "@/src/theme/shadows";

/** Rota oficial de setup de PIN (SECURITY) — usada quando operações exigem PIN não configurado */
export const PIN_SETUP_ROUTE = "/security/pin-setup";

export const DEFAULT_SCREEN_OPTIONS = {
  headerStyle: {
    backgroundColor: COLORS.background ,
  },
  headerTintColor: COLORS.darkcolor,
  headerBackTitle: "",
  ...SHADOWS.level2,
  headerShadowVisible: false, // Opcional: remove a linha divisória no iOS
};