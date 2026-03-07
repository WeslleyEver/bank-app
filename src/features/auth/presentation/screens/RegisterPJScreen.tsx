/**
 * Tela de cadastro de Pessoa Jurídica.
 * Conforme contrato do backend.
 */

import { COLORS } from "@/src/theme/colors";
import { SPACING } from "@/src/theme/spacing";
import { TYPOGRAPHY } from "@/src/theme/typography";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthButton } from "../components/AuthButton";
import { AuthInput } from "../components/AuthInput";
import { useRegisterPJ } from "../../hooks";
import { registerPJInitialValues } from "../../schemas";

export function RegisterPJScreen() {
  const router = useRouter();
  const { register, isSubmitting, error } = useRegisterPJ();

  const [values, setValues] = useState(registerPJInitialValues);

  const update = (key: keyof typeof values) => (v: string | boolean) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = async () => {
    try {
      await register({
        razaoSocial: values.razaoSocial,
        nomeFantasia: values.nomeFantasia || undefined,
        cnpj: values.cnpj,
        email: values.email,
        telefone: values.telefone,
        senha: values.senha,
        representanteLegal: {
          nome: values.representanteNome,
          cpf: values.representanteCpf,
        },
        acceptTerms: values.acceptTerms,
      });
    } catch {
      // erro tratado no hook
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Cadastro PJ</Text>
        <Text style={styles.subtitle}>
          Dados da empresa e do representante legal
        </Text>

        {error && (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <AuthInput
          label="Razão social"
          value={values.razaoSocial}
          onChangeText={update("razaoSocial")}
          placeholder="Nome da empresa"
        />
        <AuthInput
          label="Nome fantasia (opcional)"
          value={values.nomeFantasia}
          onChangeText={update("nomeFantasia")}
          placeholder="Nome fantasia"
        />
        <AuthInput
          label="CNPJ"
          value={values.cnpj}
          onChangeText={update("cnpj")}
          placeholder="Somente números"
        />
        <AuthInput
          label="E-mail"
          value={values.email}
          onChangeText={update("email")}
          placeholder="contato@empresa.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AuthInput
          label="Telefone"
          value={values.telefone}
          onChangeText={update("telefone")}
          placeholder="Somente números"
        />
        <AuthInput
          label="Nome do representante legal"
          value={values.representanteNome}
          onChangeText={update("representanteNome")}
          placeholder="Nome completo"
        />
        <AuthInput
          label="CPF do representante"
          value={values.representanteCpf}
          onChangeText={update("representanteCpf")}
          placeholder="Somente números"
        />
        <AuthInput
          label="Senha"
          value={values.senha}
          onChangeText={update("senha")}
          placeholder="Mínimo 8 caracteres"
          secureTextEntry
        />
        <AuthInput
          label="Confirmar senha"
          value={values.confirmarSenha}
          onChangeText={update("confirmarSenha")}
          placeholder="Repita a senha"
          secureTextEntry
        />

        <View style={styles.row}>
          <Switch
            value={values.acceptTerms}
            onValueChange={update("acceptTerms")}
            trackColor={{ false: "#CBD5E1", true: COLORS.primary }}
            thumbColor="#fff"
          />
          <Text style={styles.termsText}>
            Li e aceito os termos de uso e política de privacidade
          </Text>
        </View>

        <AuthButton
          title="Cadastrar"
          onPress={handleSubmit}
          loading={isSubmitting}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem conta? </Text>
          <TouchableOpacity onPress={() => router.replace("/auth/login" as Href)}>
            <Text style={styles.footerLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: SPACING.xxxl,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  termsText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.xl,
  },
  footerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  footerLink: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
