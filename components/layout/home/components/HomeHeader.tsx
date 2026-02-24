import HeaderBtn from "@/components/navigation/HeaderBtnsroutes";
import { COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { SHADOWS } from "@/src/theme/shadows";
import { SPACING } from "@/src/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Saldo disponível</Text>

        <View style={styles.valueRow}>
          <Text style={styles.value}>
            {/*
              * Quando o valor vier da API, vtrocamos:
              * {isVisible ? formatCurrency(balance) : "R$ ••••••"}
              * E cria um util:
              *const formatCurrency = (value: number) =>
                value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                });
             */}
            {isVisible ? "R$ 12.540.322,90" : "R$ ••••••"}
          </Text>

          <TouchableOpacity onPress={toggleVisibility}>
            <Ionicons
              name={isVisible ? "eye" : "eye-off"}
              size={22}
              color={COLORS.lightcolor}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.wrapper}>
          <TouchableOpacity onPress={() => router.push("/suporte/suporte")}>
            <HeaderBtn icon="logo-wechat" label="Suporte" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/transactions")}>
            <HeaderBtn icon="barcode-outline" label="Contas" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/pix/pix")}>
            <HeaderBtn icon="pix" library="fa6" label="Área Pix" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/musicos/musico")}>
            <HeaderBtn icon="guitar" library="fa6" label="Músicos" animate />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "auto",
    backgroundColor: "transparent",
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    borderBottomEndRadius: RADIUS.lg,
    borderBottomLeftRadius: RADIUS.lg,
    ...SHADOWS.level3,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  value: {
    color: COLORS.lightcolor,
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
});
