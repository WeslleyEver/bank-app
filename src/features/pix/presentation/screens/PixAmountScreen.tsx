import { COLORS } from "@/src/theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

/**
 * ------------------------------------------------------------------
 * Screen: PixAmountScreen
 * ------------------------------------------------------------------
 *
 * Segunda etapa do fluxo Pix.
 *
 * Responsável por:
 * - Capturar valor
 * - Navegar para confirmação
 *
 * Apenas coleta dados.
 * Não executa transferência.
 * ------------------------------------------------------------------
 */
export default function PixAmountScreen() {
  const { to } = useLocalSearchParams<{ to: string }>();
  const [amount, setAmount] = useState("");
  const router = useRouter();

  function handleNext() {
    const numericValue = Number(amount);
    if (!numericValue || numericValue <= 0) return;

    router.push({
      pathname: "/pix/confirm",
      params: { to, amount: numericValue },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Valor do Pix</Text>

      <TextInput
        placeholder="R$ 0,00"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: COLORS.lightcolor },
  title: { fontSize: 22, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
