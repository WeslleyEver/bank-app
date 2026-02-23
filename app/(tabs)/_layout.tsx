/* eslint-disable react-hooks/rules-of-hooks */
import { TabButton } from "@/components/navigation/TabButton";
import { Header } from "@/components/ui/Header";
import { COLORS } from "@/src/theme/colors";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <Header subtitle="Olá, Weslley" />
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textPrimary,
          headerShown: false,
          tabBarButton: (props) => <TabButton {...props} />,
          tabBarStyle: {
            height: 58 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 4,
            backgroundColor: COLORS.tabbar,
          },
        }}
      >

        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons size={size - 6} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Carteira",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="wallet"
                size={size - 6}
                color={color}
                style={{ flex: 1, left: 3, top: 4 }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="qrcode"
          options={{
            title: "",
            tabBarActiveTintColor: COLORS.primary,

            tabBarButton: () => {
              const scale = useSharedValue(1);

              const animatedStyle = useAnimatedStyle(() => {
                return {
                  transform: [{ scale: scale.value }],
                };
              });
              const router = useRouter();

              return (
                <Pressable
                  onPress={() => router.push("/qr")}
                  onPressIn={() => {
                    scale.value = withTiming(0.96, { duration: 100 });
                  }}
                  onPressOut={() => {
                    scale.value = withTiming(1.04, { duration: 100 });
                  }}
                  style={{
                    top: -18,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Animated.View
                    style={[
                      {
                        width: 66,
                        height: 66,
                        borderWidth: 6,
                        borderColor: COLORS.tabbar,
                        borderRadius: 33,
                        backgroundColor: COLORS.primary,
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 8,
                      },
                      animatedStyle,
                    ]}
                  >
                    <Ionicons
                      name="qr-code"
                      size={24}
                      color={COLORS.background_white}
                    />
                  </Animated.View>
                </Pressable>
              );
            },
          }}
        />

        <Tabs.Screen
          name="credit"
          options={{
            title: "Crédito",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome6
                name="hand-holding-dollar"
                size={size - 6}
                color={color}
              />
            ),
          }}
        />



        <Tabs.Screen
          name="cards"
          options={{
            title: "Cartões",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                size={size - 6}
                name="card"
                color={color}
                style={{
                  top: 4,
                  flex: 1,
                  left: 3,
                }}
              />
            ),
          }}
        />


      </Tabs>
    </View>
  );
}
