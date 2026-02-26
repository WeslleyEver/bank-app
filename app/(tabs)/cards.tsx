import { sendPixUseCase } from "@/src/features/pix/useCases/sendPix.useCase";
import LottieAnimation from "@/src/shared/components/animations/LottieAnimation";
import { COLORS } from "@/src/theme/colors";
import { TYPOGRAPHY } from "@/src/theme/typography";

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Cards() {
  async function handleConfirm() {
    try {
      await sendPixUseCase("Trasferencia Teste", 200);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={TYPOGRAPHY.title}>Em Breve!</Text>

      <LottieAnimation type="card" size={300}></LottieAnimation>
      <TouchableOpacity style={styles.borders} onPress={handleConfirm}>
        <Text>Enviar Pix Teste</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    flex: 1,
    backgroundColor: COLORS.background_white,
  },
  wrapper: {
    flex: 1,
    paddingBottom: 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
  sp: {
    marginTop: 13,
  },
  title: {
    color: "#000",
  },
  borders: {
    padding: 15,
    borderWidth: 1,
  },
});
