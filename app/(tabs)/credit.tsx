// import Loading from "@/components/loadings/Animations";
import { COLORS } from "@/src/theme/colors";
import { TYPOGRAPHY } from "@/src/theme/typography";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Loading from "../features/components/animations/Animations";

export default function Credit() {
  return (
    <View style={styles.container}>
      <Text style={TYPOGRAPHY.title}>Emprestimos</Text>
      <View style={styles.wrapper}>
        <Loading type="pay" size={250} loop></Loading>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: COLORS.background_white,
  },
  wrapper: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
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
});
