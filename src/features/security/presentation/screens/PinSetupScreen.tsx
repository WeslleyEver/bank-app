/**
 * Tela mínima de criação e confirmação de PIN.
 * UI não persiste PIN; não acessa infra diretamente.
 * Recebe accountId como prop (caller obtém de AUTH/sessão).
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
import { usePinSetup } from "../../hooks/usePinSetup";
import { PIN_LENGTH } from "../../constants";
import { getSetupErrorMessage } from "../utils/setupPinErrorMessages";
import { AuthButton } from "@/src/features/auth/presentation/components/AuthButton";
import { AuthInput } from "@/src/features/auth/presentation/components/AuthInput";

type PinSetupScreenProps = {
  accountId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function PinSetupScreen({
  accountId,
  onSuccess,
  onCancel,
}: PinSetupScreenProps) {
  const [pin, setPin] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const { setup, isLoading, lastErrorCode, clearError, cancelSetup } = usePinSetup();

  const errorMessage = getSetupErrorMessage(lastErrorCode);

  const handlePinChange = useCallback(
    (value: string) => {
      const digits = value.replace(/\D/g, "").slice(0, PIN_LENGTH);
      setPin(digits);
      if (lastErrorCode) clearError();
    },
    [lastErrorCode, clearError]
  );

  const handleConfirmationChange = useCallback(
    (value: string) => {
      const digits = value.replace(/\D/g, "").slice(0, PIN_LENGTH);
      setConfirmation(digits);
      if (lastErrorCode) clearError();
    },
    [lastErrorCode, clearError]
  );

  const handleSubmit = useCallback(async () => {
    const result = await setup({ pin, confirmation, accountId });
    if (result.success) {
      setPin("");
      setConfirmation("");
      onSuccess?.();
    }
  }, [pin, confirmation, accountId, setup, onSuccess]);

  const handleCancel = useCallback(() => {
    // Limpeza explícita do estado temporário no cancelamento
    setPin("");
    setConfirmation("");
    cancelSetup(); // limpa lastErrorCode na store
    onCancel?.();
  }, [cancelSetup, onCancel]);

  const canSubmit =
    pin.length === PIN_LENGTH &&
    confirmation.length === PIN_LENGTH &&
    !isLoading;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Criar PIN</Text>
        <Text style={styles.subtitle}>
          Digite um PIN de 6 dígitos para proteger operações sensíveis.
        </Text>

        {errorMessage && (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <AuthInput
          value={pin}
          onChangeText={handlePinChange}
          placeholder="Digite o PIN (6 dígitos)"
          keyboardType="number-pad"
          secureTextEntry
          maxLength={PIN_LENGTH}
        />

        <AuthInput
          value={confirmation}
          onChangeText={handleConfirmationChange}
          placeholder="Confirme o PIN"
          keyboardType="number-pad"
          secureTextEntry
          maxLength={PIN_LENGTH}
        />

        <AuthButton
          title="Criar PIN"
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
