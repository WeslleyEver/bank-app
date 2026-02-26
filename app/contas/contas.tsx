import LottieAnimation from "@/src/shared/components/animations/LottieAnimation";
import { StyleSheet, Text, View } from "react-native";

export default function ContasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuraçoes</Text>
      <LottieAnimation type="disc" loop></LottieAnimation>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#000",
    fontSize: 22,
    fontWeight: "600",
  },
});
