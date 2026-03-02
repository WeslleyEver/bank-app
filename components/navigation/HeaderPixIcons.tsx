import { COLORS } from "@/src/theme/colors";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = {
  label: string;
  icon: string;
  library?: "ion" | "fa6";
  animate?: boolean;
};

export default function HeaderPixIcons({
  icon,
  label,
  library = "ion",
  animate = false,
}: Props) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (!animate) return;

    rotation.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 150 }),
        withTiming(15, { duration: 150 }),
        withTiming(-10, { duration: 120 }),
        withTiming(10, { duration: 120 }),
        withTiming(0, { duration: 150 }),
        withDelay(2000, withTiming(0)),
      ),
      -1,
      false,
    );
  }, [animate]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const IconComponent = library === "ion" ? Ionicons : FontAwesome6;

  return (
    <Animated.View style={animate ? animatedStyle : undefined}>
      <View style={styles.container}>
        <View style={styles.btn}>
          <IconComponent size={22} name={icon as any} color={COLORS.primary} />
        </View>

        <Text style={styles.label}>{label}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  btn: {
    width: 56,
    height: 56,
    marginTop: 18,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5454540e",
  },
  label: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.darkcolor,
  },
});
