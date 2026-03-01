import LottieAnimation from "@/src/shared/components/animations/LottieAnimation";
import { COLORS } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * ------------------------------------------------------------------
 * Screen: PixSuccessScreen
 * ------------------------------------------------------------------
 *
 * Tela exibida após sucesso da operação.
 *
 * Apenas feedback visual.
 * Não executa lógica.
 * ------------------------------------------------------------------
 */
export default function PixSuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LottieAnimation type="success" size={180} loop={false} />
      <Text style={styles.title}>Pix enviado com sucesso!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.buttonText}>Voltar para Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightcolor,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 20, marginTop: 20 },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
