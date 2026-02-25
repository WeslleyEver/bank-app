import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

export function FloatingQrButton({ colors }: any) {
  const scale = useSharedValue(1);
  const router = useRouter();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={() => router.push("/qr")}
      onPressIn={() => (scale.value = withTiming(0.96, { duration: 100 }))}
      onPressOut={() => (scale.value = withTiming(1.04, { duration: 100 }))}
      style={{
        top: 17,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 62,
            height: 62,
            borderRadius: 31,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
            elevation: 3,
            zIndex: 999,
          },
          animatedStyle,
        ]}
      >
        <Ionicons name="qr-code" size={24} color="#fff" />
      </Animated.View>
    </Pressable>
  );
}
