import { colors } from "@/theme";
import { Stack } from "expo-router";

export default function MenuLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.ink,
      }}
    >
      <Stack.Screen name="home" />
    </Stack>
  );
}
