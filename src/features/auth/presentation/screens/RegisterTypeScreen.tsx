/**
 * Tela de seleção do tipo de cadastro (PF ou PJ)
 */

import { COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { SPACING } from "@/src/theme/spacing";
import { TYPOGRAPHY } from "@/src/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { PersonType } from "../../types";

export function RegisterTypeScreen() {
  const router = useRouter();

  const handleSelect = (type: PersonType) => {
    if (type === "PF") {
      router.push("/auth/register-pf" as Href);
    } else {
      router.push("/auth/register-pj" as Href);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Como você quer se cadastrar?</Text>
      <Text style={styles.subtitle}>
        Escolha o tipo de conta que melhor representa você
      </Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => handleSelect("PF")}
        activeOpacity={0.8}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="person" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.cardTitle}>Pessoa Física</Text>
        <Text style={styles.cardDesc}>
          Para uso pessoal, contas individuais
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => handleSelect("PJ")}
        activeOpacity={0.8}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="business" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.cardTitle}>Pessoa Jurídica</Text>
        <Text style={styles.cardDesc}>
          Para empresas e CNPJ
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Já tem conta? </Text>
        <TouchableOpacity onPress={() => router.replace("/auth/login" as Href)}>
          <Text style={styles.footerLink}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background_white,
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
  card: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  cardTitle: {
    ...TYPOGRAPHY.subtitle_2,
    color: COLORS.darkcolor,
    marginBottom: SPACING.xs,
  },
  cardDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.xxl,
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
