import Loading from "@/components/loadings/Animations";
import { StyleSheet, Text, View } from "react-native";

export default function ContasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuraçoes</Text>
      <Loading type="disc" loop></Loading>
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
