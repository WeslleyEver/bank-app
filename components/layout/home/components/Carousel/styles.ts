import { RADIUS } from "@/src/theme/radius";
import { SHADOWS } from "@/src/theme/shadows";
import { SPACING } from "@/src/theme/spacing";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  card: {
    height: 290,
    width: width - 24,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xxxl,
    marginTop: SPACING.md,
    backgroundColor: "#868585",
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...SHADOWS.level2,
  },

  textContainer: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },

  action: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },

  image: {
    width: 110,
    height: 140,
    borderRadius: 16,
  },
});
