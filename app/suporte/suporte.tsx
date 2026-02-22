import { StyleSheet, Text, View } from "react-native";

export default function SuporteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suporte</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "600",
  },
});
