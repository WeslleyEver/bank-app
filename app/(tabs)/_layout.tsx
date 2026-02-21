/* eslint-disable react-hooks/rules-of-hooks */
import { Header } from "@/components/ui/Header";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";

import { TabButton } from "@/components/navigation/TabButton";
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
  // const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Header subtitle="Olá, Weslley 👋" title="Bem-vindo ao Banco" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#EB0459",
          tabBarInactiveTintColor: "#fff",
          headerShown: false,
          tabBarButton: (props) => <TabButton {...props} />,
          tabBarStyle: {
            height: 58 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 4,
            backgroundColor: "#131313",
          },
        }}
      >
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
          name="qrcode"
          options={{
            title: "",
            tabBarActiveTintColor: "#EB0459",

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
                    top: -20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Animated.View
                    style={[
                      {
                        width: 62,
                        height: 62,
                        borderRadius: 31,
                        backgroundColor: "#EB0459",
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 8,
                      },
                      animatedStyle,
                    ]}
                  >
                    <Ionicons name="qr-code" size={24} color="#FFF" />
                  </Animated.View>
                </Pressable>
              );
            },
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

        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons size={size - 6} name="home" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
