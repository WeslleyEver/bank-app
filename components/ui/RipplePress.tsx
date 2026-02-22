import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

type Props = {
  children: React.ReactNode;
  style?: any;
  rippleColor?: string;
  onPress?: () => void;
};

export function RipplePress({
  children,
  style,
  rippleColor = "rgba(0, 0, 0, 0.2)",
  onPress,
}: Props) {
  const scale = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value === 0 ? 0 : 1,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(1, { duration: 300 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(0, { duration: 300 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, style]}
    >
      <Animated.View
        style={[styles.ripple, { backgroundColor: rippleColor }, animatedStyle]}
      />
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  ripple: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: "center",
  },
});
