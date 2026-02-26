/**
 * LoadingOverlay
 *
 * Componente de overlay para bloquear a tela
 * durante operações assíncronas (ex: confirmação de PIX).
 *
 * - Fundo escuro e semi-transparente
 * - Centraliza animação Lottie
 * - Impede interação do usuário
 */
import LottieAnimation from "@/src/shared/components/animations/LottieAnimation";
import { StyleSheet, View } from "react-native";

type Props = {
  visible: boolean;
};

export default function LoadingOverlay({ visible }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <LottieAnimation type="transfer" size={450} loop />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)", // Fundo escuro transparente
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
