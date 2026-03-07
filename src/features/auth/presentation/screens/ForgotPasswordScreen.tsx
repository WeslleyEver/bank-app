/**
 * Tela de recuperação de senha.
 * Usa documento (CPF ou CNPJ).
 */

import { COLORS } from "@/src/theme/colors";
import { SPACING } from "@/src/theme/spacing";
import { TYPOGRAPHY } from "@/src/theme/typography";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AuthButton } from "../components/AuthButton";
import { AuthInput } from "../components/AuthInput";
import { useForgotPassword } from "../../hooks";
import { forgotPasswordInitialValues } from "../../schemas";

export function ForgotPasswordScreen() {
  const router = useRouter();
  const { submit, isSubmitting, error, success } = useForgotPassword();
  const [documento, setDocumento] = useState(
    forgotPasswordInitialValues.documento
  );

  const handleSubmit = async () => {
    try {
      await submit({ documento });
    } catch {
      // erro tratado no hook
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.successWrap}>
          <Text style={styles.successTitle}>Solicitação enviada!</Text>
          <Text style={styles.successText}>
            Se existe uma conta com esse documento, você receberá as instruções
            para redefinir sua senha.
          </Text>
          <AuthButton
            title="Voltar ao login"
            onPress={() => router.back()}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Recuperar senha</Text>
        <Text style={styles.subtitle}>
          Informe seu CPF ou CNPJ para receber as instruções
        </Text>

        {error && (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <AuthInput
          label="CPF ou CNPJ"
          value={documento}
          onChangeText={setDocumento}
          placeholder="Somente números"
          keyboardType="numeric"
        />

        <AuthButton
          title="Enviar"
          onPress={handleSubmit}
          loading={isSubmitting}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background_white,
  },
  scroll: {
    flexGrow: 1,
    padding: SPACING.xl,
    paddingTop: SPACING.xxxl,
  },
  title: {
    ...TYPOGRAPHY.title,
    color: COLORS.darkcolor,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
  },
  errorWrap: {
    backgroundColor: "#FEE2E2",
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: "#B91C1C",
  },
  successWrap: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: "center",
  },
  successTitle: {
    ...TYPOGRAPHY.title,
    color: COLORS.darkcolor,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  successText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
    textAlign: "center",
  },
});
