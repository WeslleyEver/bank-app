import { COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { SPACING } from "@/src/theme/spacing";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export default function Button({ title, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.sm,
    borderRadius: RADIUS.lg,
    alignItems: "center",
  },
  btnText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
});
