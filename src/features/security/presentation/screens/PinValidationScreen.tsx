/**
 * Tela mínima de digitação e validação de PIN.
 * UI não persiste PIN; não acessa infra diretamente.
 * Cancelamento não incrementa tentativas.
 */

import { COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { SPACING } from "@/src/theme/spacing";
import { TYPOGRAPHY } from "@/src/theme/typography";
import { useState, useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePinValidate } from "../../hooks/usePinValidate";
import { PIN_LENGTH } from "../../constants";
import { getValidationErrorMessageFromCode } from "../utils/validatePinErrorMessages";
import { AuthButton } from "@/src/features/auth/presentation/components/AuthButton";
import { AuthInput } from "@/src/features/auth/presentation/components/AuthInput";

type PinValidationScreenProps = {
  accountId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function PinValidationScreen({
  accountId,
  onSuccess,
  onCancel,
}: PinValidationScreenProps) {
  const [pin, setPin] = useState("");
  const { validate, isLoading, lastErrorCode, cancelValidation } = usePinValidate();

  const errorMessage = getValidationErrorMessageFromCode(lastErrorCode);

  const handlePinChange = useCallback(
    (value: string) => {
      const digits = value.replace(/\D/g, "").slice(0, PIN_LENGTH);
      setPin(digits);
      if (lastErrorCode) cancelValidation();
    },
    [lastErrorCode, cancelValidation]
  );

  const handleSubmit = useCallback(async () => {
    const result = await validate({ pin, accountId });
    if (result.status === "validated") {
      setPin("");
      onSuccess?.();
    }
  }, [pin, accountId, validate, onSuccess]);

  const handleCancel = useCallback(() => {
    setPin("");
    cancelValidation();
    onCancel?.();
  }, [cancelValidation, onCancel]);

  const canSubmit = pin.length === PIN_LENGTH && !isLoading;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Digite seu PIN</Text>
        <Text style={styles.subtitle}>
          Digite o PIN de 6 dígitos para continuar.
        </Text>

        {errorMessage && (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <AuthInput
          value={pin}
          onChangeText={handlePinChange}
          placeholder="PIN (6 dígitos)"
          keyboardType="number-pad"
          secureTextEntry
          maxLength={PIN_LENGTH}
        />

        <AuthButton
          title="Confirmar"
          onPress={handleSubmit}
          disabled={!canSubmit}
          loading={isLoading}
        />

        {onCancel && (
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background_white ?? COLORS.background,
  },
  scroll: {
    padding: SPACING.xl,
    paddingTop: SPACING.xxxl,
  },
  title: {
    ...TYPOGRAPHY.title,
    color: COLORS.darkcolor,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary ?? "#94A3B8",
    marginBottom: SPACING.xl,
  },
  errorWrap: {
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: "#FEF2F2",
    borderRadius: RADIUS.md,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: "#EF4444",
  },
  cancelBtn: {
    marginTop: SPACING.lg,
    alignItems: "center",
  },
  cancelText: {
    ...TYPOGRAPHY.subtitle_2,
    color: COLORS.primary,
  },
});
