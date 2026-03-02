import HeaderPixIcons from "@/components/navigation/HeaderPixIcons";
import { COLORS } from "@/src/theme/colors";
import { SPACING } from "@/src/theme/spacing";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function HeaderPixScreen() {
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <View style={styles.wrapper}>
          <TouchableOpacity onPress={() => router.push("/pix/key")}>
            <HeaderPixIcons  icon="swap-horizontal" label="Transferir" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/pix/key")}>
            <HeaderPixIcons icon="copy-outline" label="Pix Copia e Cola" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/qr")}>
            <HeaderPixIcons icon="qrcode" library="fa6" label="QRcode" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/musicos/musico")}>
            <HeaderPixIcons icon="arrow-down" label="Receber Pix"/>
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
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,

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
