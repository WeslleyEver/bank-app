import React from "react";
import { Pressable } from "react-native";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

export function SpinButton({ children, style, onPress }: any) {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handlePress = () => {
    rotation.value = withTiming(
      rotation.value + 100,
      { duration: 150 },
      (finished) => {
        if (finished && onPress) {
          runOnJS(onPress)();
        }
      },
    );
  };

  return (
    <Pressable onPress={handlePress} style={style}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}
