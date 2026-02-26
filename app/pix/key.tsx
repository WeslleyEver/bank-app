import { COLORS } from "@/src/theme/colors";
import { useRouter } from "expo-router";
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
 * Screen: PixKeyScreen
 * ------------------------------------------------------------------
 *
 * Primeira etapa do fluxo Pix.
 *
 * Responsável por:
 * - Capturar chave do destinatário
 * - Navegar para tela de valor
 *
 * Não executa regra financeira.
 * Apenas coleta dados.
 * ------------------------------------------------------------------
 */

export default function PixKeyScreen() {
  const [key, setKey] = useState("");
  const router = useRouter();

  function handleNext() {
    if (!key.trim()) return;
    router.push({
      pathname: "/pix/amount",
      params: { to: key },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enviar Pix</Text>

      <TextInput
        placeholder="Digite a chave Pix"
        value={key}
        onChangeText={setKey}
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
