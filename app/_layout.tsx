import { useColorScheme } from "@/hooks/use-color-scheme";
import { COLORS } from "@/src/theme/colors";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { Stack, Href, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import "react-native-reanimated";

import { initializeHttpClient } from "@/src/bootstrap";
import { useAuthStore } from "@/src/features/auth";

const PROTECTED_ROOT_SEGMENTS = [
  "(tabs)",
  "pix",
  "transactions",
  "user",
  "settings",
  "contas",
  "qr",
  "suporte",
  "musicos",
] as const;

const PUBLIC_ROOT_SEGMENTS = [
  "",
  "index",
  "welcome",
  "loading",
  "auth",
  "modal",
] as const;

function isProtectedRoute(segments: string[]): boolean {
  const root = segments[0] ?? "";

  if (PUBLIC_ROOT_SEGMENTS.includes(root as (typeof PUBLIC_ROOT_SEGMENTS)[number])) {
    return false;
  }

  return PROTECTED_ROOT_SEGMENTS.includes(root as (typeof PROTECTED_ROOT_SEGMENTS)[number]);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments() as string[];

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    async function setup() {
      await SystemUI.setBackgroundColorAsync(COLORS.background_white);
      await NavigationBar.setButtonStyleAsync("dark");
      initializeHttpClient();
    }
    setup();
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const onWelcome = segments.length === 1 && segments[0] === "welcome";
    const protectedRoute = isProtectedRoute(segments);

    if (!isAuthenticated && protectedRoute && !onWelcome) {
      router.replace("/welcome" as Href);
    }
  }, [isAuthenticated, isInitialized, segments, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="loading" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
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
