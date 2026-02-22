import { Platform } from "react-native";

export const SHADOWS = {
  card: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    android: {
      elevation: 6,
    },
  }),
};
