import LottieAnimation from "@/src/shared/components/animations/LottieAnimation";
import { StyleSheet, Text, View } from "react-native";

export default function MusicoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Para Músicos</Text>
      <LottieAnimation type="band" loop size={350}></LottieAnimation>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3eff0",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#000",
    fontSize: 22,
    fontWeight: "600",
  },
});
