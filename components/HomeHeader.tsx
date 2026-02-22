import { COLORS } from "@/src/theme/colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { router } from "expo-router";
import HeaderBtn from "./navigation/HeaderBtnsroutes";
// import { TabButton } from "./navigation/TabButton";

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Saldo disponível</Text>
        <Text style={styles.value}>R$ 12.540,90</Text>

        <View style={styles.wrapper}>
          <HeaderBtn icon="logo-wechat" label="Suporte" />
          <HeaderBtn icon="barcode-outline" label="Contas" />
          <HeaderBtn icon="pix" library="fa6" label="Área Pix" />
          <Pressable onPress={() => router.push("/settings/settings")}>
            <HeaderBtn icon="guitar" library="fa6" label="Músicos" animate />
          </Pressable>
          {/* <TabButton onPress={() => router.push("/settings/settings")}>
            <HeaderBtn icon="guitar" library="fa6" label="Músicos" animate />
          </TabButton> */}
        </View>
      </View>
    </View>
    //     {/* <Pressable
    //       style={styles.button}
    //       onPress={() => router.push("/pix/confirm")}
    //     >
    //       <Text style={styles.buttonText}>Ir para teste Pix</Text>
    //     </Pressable> */}
  );
}
const styles = StyleSheet.create({
  container: {
    height: "auto",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 22,
    elevation: 8, // Android
    borderWidth: 1,
    borderColor: COLORS.primary,
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
