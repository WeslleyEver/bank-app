import { useFocusEffect } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useRef } from "react";

type Props = {
  type?:
    | "metronome"
    | "card"
    | "pay"
    | "success"
    | "disc"
    | "band"
    | "load"
    | "transfer";
  size?: number;
  loop?: boolean;
};

const animations = {
  metronome: require("@/assets/animations/metronome.json"),
  card: require("@/assets/animations/CardLottieAnimation.json"),
  pay: require("@/assets/animations/Emprestimo.json"),
  success: require("@/assets/animations/Success.json"),
  disc: require("@/assets/animations/playermusic.json"),
  load: require("@/assets/animations/loading.json"),
  band: require("@/assets/animations/band.json"),
  transfer: require("@/assets/animations/Transfer Money.json"),
};

/**
 * ------------------------------------------------------------------
 * Component: LottieAnimation
 * ------------------------------------------------------------------
 *
 * Componente reutilizável para renderização de animações Lottie.
 *
 * Camada: Shared (UI base)
 *
 * Responsabilidades:
 * - Renderizar animação baseada em tipo
 * - Controlar play/reset ao focar na tela
 * - Permitir controle de tamanho e loop
 *
 * Não deve:
 * - Conter regra de negócio
 * - Depender de features específicas
 *
 * Pode ser utilizado em:
 * - Loading screens
 * - Confirmação de pagamento
 * - Tela de sucesso
 * - Estados vazios
 *
 * ------------------------------------------------------------------
 */
export default function LottieAnimation({
  type = "metronome",
  size = 150,
  loop = false,
}: Props) {
  const animation = useRef<LottieView>(null);

  useFocusEffect(
    useCallback(() => {
      animation.current?.reset();
      animation.current?.play();
    }, []),
  );

  return (
    <LottieView
      ref={animation}
      source={animations[type]}
      loop={loop}
      autoPlay
      style={{ width: size, height: size }}
    />
  );
}
