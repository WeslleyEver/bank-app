/**
 * Tela genérica de challenge transacional (v1: PIN).
 * Não é específica de Pix — reutilizável por qualquer operação sensível.
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
import { useTransactionalChallenge } from "../../hooks/useTransactionalChallenge";
import { PIN_LENGTH } from "../../constants";
import { getValidationErrorMessageFromCode } from "../utils/validatePinErrorMessages";
import { useSecurityStore } from "../../store";
import { AuthButton } from "@/src/features/auth/presentation/components/AuthButton";
import { AuthInput } from "@/src/features/auth/presentation/components/AuthInput";

type TransactionalChallengeScreenProps = {
  onCancel?: () => void;
};

export function TransactionalChallengeScreen({
  onCancel,
}: TransactionalChallengeScreenProps) {
  const [pin, setPin] = useState("");
  const currentChallenge = useSecurityStore((s) => s.currentChallenge);
  const lastErrorCode = useSecurityStore((s) => s.lastErrorCode);
  const {
    resolveChallenge,
    cancelChallenge,
    isResolving,
  } = useTransactionalChallenge();

  const errorMessage = getValidationErrorMessageFromCode(lastErrorCode);
  const accountId = currentChallenge?.accountId ?? "";

  const setLastErrorCode = useSecurityStore((s) => s.setLastErrorCode);

  const handlePinChange = useCallback(
    (value: string) => {
      const digits = value.replace(/\D/g, "").slice(0, PIN_LENGTH);
      setPin(digits);
      if (lastErrorCode) setLastErrorCode(null);
    },
    [lastErrorCode, setLastErrorCode]
  );

  const handleSubmit = useCallback(async () => {
    if (!accountId) return;
    const result = await resolveChallenge(pin, accountId);
    if (result.status === "authorized") {
      setPin("");
    }
  }, [pin, accountId, resolveChallenge]);

  const handleCancel = useCallback(() => {
    setPin("");
    cancelChallenge();
    onCancel?.();
  }, [cancelChallenge, onCancel]);

  const canSubmit = pin.length === PIN_LENGTH && !isResolving && !!accountId;

  if (!currentChallenge) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Confirmar operação</Text>
        <Text style={styles.subtitle}>
          Digite seu PIN de 6 dígitos para autorizar.
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
          loading={isResolving}
        />

        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
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
