import { AnimatedTabIndicator } from "@/components/navigation/AnimatedTabIndicator";
import { Header } from "@/components/ui/Header";
import { COLORS } from "@/src/theme/colors";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FloatingQrButton } from "@/components/navigation/FloatingQrButton";

function TabBarButton({ children, style, ...props }: any) {
  return (
    <Pressable
      {...props}
      style={[
        style,
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      {children}
    </Pressable>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const routesOrder = ["index", "account", "qrcode", "credit", "cards"];

  const pathname = usePathname();

  return (
    <View style={{ flex: 1 }}>
      <Header subtitle="Olá, Weslley" />
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: "#5c5b5b",
          headerShown: false,
          tabBarButton: (props) => <TabBarButton {...props} />,
          tabBarStyle: {
            height: 54 + insets.bottom,
            paddingBottom: insets.bottom,
            backgroundColor: COLORS.tabbarligth,
            // borderWidth: 1,
            borderTopWidth: 0,
            // borderColor: COLORS.lightcolor,
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
            tabBarButton: () => <FloatingQrButton colors={COLORS} />,
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
      <AnimatedTabIndicator
        pathname={pathname}
        routes={routesOrder}
        bottom={insets.bottom + 52}
        color={COLORS.primary}
      />
    </View>
  );
}
