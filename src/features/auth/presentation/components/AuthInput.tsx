/**
 * Input reutilizável para telas de auth
 */

import { COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { SPACING } from "@/src/theme/spacing";
import { TYPOGRAPHY } from "@/src/theme/typography";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type AuthInputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function AuthInput({ label, error, style, ...props }: AuthInputProps) {
  return (
    <View style={styles.wrap}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor="#94A3B8"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: SPACING.lg,
  },
  label: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkcolor,
    marginBottom: SPACING.xs,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: COLORS.darkcolor,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: "#EF4444",
    marginTop: SPACING.xs,
  },
});
