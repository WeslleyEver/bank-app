import { COLORS } from "@/src/theme/colors";
import React, { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

export function AnimatedTabIndicator({ pathname, routes, bottom, color }: any) {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);

  useEffect(() => {
    const route = pathname.split("/").pop();
    const currentRoute = route || "index";
    const index = routes.indexOf(currentRoute);

    if (index !== -1 && currentRoute !== "qrcode") {
      const tabWidth = width / routes.length;
      translateX.value = withTiming(index * tabWidth, {
        duration: 300,
      });
    }
  }, [pathname, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          borderRadius: 12,
          position: "absolute",
          bottom,
          height: 3,
          width: width / routes.length,
          backgroundColor: color,
          shadowColor: COLORS.primary,
          shadowOpacity: 0.4,
          shadowRadius: 4,
          elevation: 4,
        },
        animatedStyle,
      ]}
    />
  );
}
