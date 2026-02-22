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

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function setup() {
      await SystemUI.setBackgroundColorAsync(COLORS.tabbar);
      await NavigationBar.setBackgroundColorAsync(COLORS.tabbar);
      await NavigationBar.setButtonStyleAsync("light");
    }

    setup();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>

      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
