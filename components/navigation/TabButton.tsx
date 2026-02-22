import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function TabButton({ children, style, ...props }: any) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      {...props}
      style={[
        style,
        {
          flex: 1,
          // justifyContent: "center",'
          alignItems: "center",
        },
      ]}
      onPressIn={() => {
        scale.value = withTiming(0.96, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1.03, { duration: 100 });
      }}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}
