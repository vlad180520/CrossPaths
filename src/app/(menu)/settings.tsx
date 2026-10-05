import { supabase } from "@/lib/supabase";
import { colors, fonts } from "@/theme";
import { useProfileDraft } from "@/state/profile";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function Settings() {
  const router = useRouter();
  const { reset } = useProfileDraft();
  const [resetting, setResetting] = useState(false);

  const resetProfile = () => {
    Alert.alert(
      "Reset your profile?",
      "This clears your name, role, and interests and starts onboarding over.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            setResetting(true);

            const {
              data: { user },
            } = await supabase.auth.getUser();

            if (user) {
              const { error } = await supabase
                .from("profiles")
                .delete()
                .eq("user_id", user.id);

              if (error) {
                setResetting(false);
                Alert.alert("Could not reset profile", error.message);
                return;
              }
            }

            setResetting(false);
            reset();
            router.replace("/");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: true, title: "Settings" }} />

      <Pressable
        style={[styles.row, resetting && { opacity: 0.5 }]}
        onPress={resetProfile}
        disabled={resetting}
      >
        <Text style={styles.rowText}>
          {resetting ? "Resetting…" : "Reset profile"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 20,
  },
  row: {
    backgroundColor: colors.chip,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  rowText: {
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
  },
});
