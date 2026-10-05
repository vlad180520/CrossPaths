import { ensureAnonymousSession } from "@/lib/supabase";
import { ProfileProvider } from "@/state/profile";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  useEffect(() => {
    ensureAnonymousSession().catch(() => {
      // useOnboardingStatus (index.tsx) will retry and handle this properly;
      // this early call is just a head start, so a failure here is silent.
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProfileProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              // contentStyle: { backgroundColor: colors.bg },
            }}
          />
        </ProfileProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
