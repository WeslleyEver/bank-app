import { HapticTab } from '@/components/haptic-tab';
import { Header } from '@/components/ui/Header';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FontAwesome6 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  return (

    <View style={{ flex: 1 }}>
      <Header
        subtitle="Olá, Weslley 👋"
        title="Bem-vindo ao Banco" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            height: 58 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: 12,
            backgroundColor: "#2b2b2b",
          },
        }}>
        {/* <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="sistrix" color={color} />,
          }} /> */}
        <Tabs.Screen
          name="account"
          options={{
            title: "Conta",
            tabBarIcon: ({ color, size }) => (

              <FontAwesome6 name="wallet" size={size - 3} color={color} />
            ),
          }} />



        <Tabs.Screen
          name="credit"
          options={{
            title: "Crédito",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome6 name="dollar" size={size - 3} color={color} />
            ),
          }} />

        <Tabs.Screen
          name="qrcode"
          options={{
            title: '',
            tabBarIcon: ({ color, size }) => <FontAwesome6 size={size - 3} name="qrcode" color={color} />,
          }} />

        <Tabs.Screen
          name="cards"
          options={{
            title: 'Cartões',
            tabBarIcon: ({ color, size }) => <FontAwesome6 size={size - 3} name="credit-card" color={color} />,
          }} />

        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <FontAwesome6 size={size - 3} name="house" color={color} />,
          }} />
      </Tabs>
    </View>


  );
}
