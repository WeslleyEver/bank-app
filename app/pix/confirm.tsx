import LoadingOverlay from "@/src/features/account/components/feedback/LoadingOverlay";
import { sendPixUseCase } from "@/src/features/pix/useCases/sendPix.useCase";
import { COLORS } from "@/src/theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * ------------------------------------------------------------------
 * Screen: PixConfirmScreen
 * ------------------------------------------------------------------
 *
 * Terceira etapa do fluxo.
 *
 * Responsável por:
 * - Exibir resumo da transferência
 * - Executar envio através do UseCase
 *
 * Aqui ocorre a operação real.
 * ------------------------------------------------------------------
 */
export default function PixConfirmScreen() {
  const { to, amount } = useLocalSearchParams<{
    to: string;
    amount: string;
  }>();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    try {
      setLoading(true);

      const MIN_LOADING_TIME = 3500; // 👈 3.5 segundos

      const startTime = Date.now();

      await sendPixUseCase(to, Number(amount));

      const elapsedTime = Date.now() - startTime;

      if (elapsedTime < MIN_LOADING_TIME) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_LOADING_TIME - elapsedTime),
        );
      }

      router.replace("/pix/success");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar Pix</Text>
      <Text>Destinatário: {to}</Text>
      <Text>Valor: R$ {amount}</Text>

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>

      {/* Overlay escuro com animação central */}
      <LoadingOverlay visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: COLORS.lightcolor },
  title: { fontSize: 22, marginBottom: 20 },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: COLORS.lightcolor, fontWeight: "bold" },
});
