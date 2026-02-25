import { useColorScheme } from "@/hooks/use-color-scheme";
// import { COLORS } from "@/src/theme/colors";
import { COLORS } from "@/src/theme/colors";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import "react-native-reanimated";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function setup() {
      await SystemUI.setBackgroundColorAsync(COLORS.tabbarligth);
      await NavigationBar.setBackgroundColorAsync(COLORS.tabbarligth);
      await NavigationBar.setButtonStyleAsync("dark");
    }
    setup();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
        }}
      >
        <Stack.Screen name="loading" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>

      {/* <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
        }}
      >
        <Stack.Screen name="loading" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack> */}

      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
