import { StyleSheet, Text, View } from "react-native";
import Loading from "../features/components/animations/Animations";

export default function MusicoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Para Músicos</Text>
      {/* <Loading type="metronome" loop size={200}></Loading> */}
      <Loading type="band" loop size={350}></Loading>
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
