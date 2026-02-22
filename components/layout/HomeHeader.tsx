import { COLORS } from "@/src/theme/colors";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HeaderBtn from "../navigation/HeaderBtnsroutes";
// import HeaderBtn from "@/navigation/HeaderBtnsroutes";
// import { TabButton } from "./navigation/TabButton";

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Saldo disponível</Text>
        <Text style={styles.value}>R$ 12.540,90</Text>

        <View style={styles.wrapper}>
          <TouchableOpacity onPress={() => router.push("/suporte/suporte")}>
            <HeaderBtn icon="logo-wechat" label="Suporte" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/contas/contas")}>
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
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 22,
    // elevation: 8, // Android
    // borderWidth: 1,
    // borderColor: COLORS.primary,
    borderBottomEndRadius: 22,
    borderBottomLeftRadius: 22,
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
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    borderBottomEndRadius: 21,
    borderBottomLeftRadius: 21,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  value: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
});
