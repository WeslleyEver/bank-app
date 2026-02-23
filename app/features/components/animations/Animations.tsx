import { useFocusEffect } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useRef } from "react";

type Props = {
  type?: "metronome" | "card" | "pay" | "success" | "disc";
  size?: number;
  loop?: boolean;
};

const animations = {
  metronome: require("@/assets/animations/metronome.json"),
  card: require("@/assets/animations/CardLottieAnimation.json"),
  pay: require("@/assets/animations/Emprestimo.json"),
  success: require("@/assets/animations/Success.json"),
  disc: require("@/assets/animations/playermusic.json"),
};

export default function Loading({
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
