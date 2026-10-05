import OnboardingScaffold from "@/components/onboarding/OnboardingScaffold";
import { ensureAnonymousSession, supabase } from "@/lib/supabase";
import { useProfileDraft } from "@/state/profile";
import { colors, fonts, INTEREST_POOL, radius } from "@/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function Interests() {
  const router = useRouter();
  const { firstName, lastName, role, interests, toggleInterest } =
    useProfileDraft();
  const [saving, setSaving] = useState(false);

  const finish = async () => {
    setSaving(true);

    try {
      await ensureAnonymousSession();
    } catch {
      setSaving(false);
      Alert.alert(
        "Could not start your session",
        "Check your connection and try again."
      );
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .insert({ first_name: firstName, last_name: lastName, role, interests });
    setSaving(false);

    if (error) {
      Alert.alert("Could not save your profile", error.message);
      return;
    }

    router.replace({ pathname: "/home", params: { justOnboarded: "1" } });
  };

  return (
    <OnboardingScaffold
      step={2}
      total={3}
      isWelcome={false}
      buttonLabel={saving ? "Saving…" : "Continue"}
      disabled={interests.length === 0 || saving}
      onNext={finish}
    >
      <View>
        <Text style={styles.h1}>What are you into?</Text>
        <Text style={styles.p}>
          <Text style={styles.count}>{interests.length} selected</Text>
        </Text>
        <View style={styles.grid}>
          {INTEREST_POOL.map((label) => {
            const on = interests.includes(label);
            return (
              <Pressable
                key={label}
                onPress={() => toggleInterest(label)}
                style={[styles.chip, on ? styles.chipOn : styles.chipOff]}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontFamily: fonts.heading,
    fontWeight: "600",
    fontSize: 28,
    lineHeight: 31,
    letterSpacing: -0.5,
    color: colors.ink,
    marginBottom: 6,
  },
  p: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 21,
    color: colors.muted,
    marginBottom: 20,
  },
  count: { color: colors.primary, fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  chipOff: { backgroundColor: colors.white, borderColor: colors.border },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    fontWeight: "500",
    color: colors.muted2,
  },
  chipTextOn: { color: colors.white, fontWeight: "600" },
});
