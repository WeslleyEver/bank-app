import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function PixConfirm() {
  const { payload } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar Pix</Text>
      <Text style={styles.payload}>{payload}</Text>
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
    marginBottom: 20,
  },
  payload: {
    color: "#94A3B8",
  },
});
