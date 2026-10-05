import { supabase } from "@/lib/supabase";
import { useProfileDraft } from "@/state/profile";
import { colors, fonts, INTEREST_POOL, radius } from "@/theme";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EditProfile() {
  const router = useRouter();
  const {
    firstName,
    lastName,
    role,
    interests,
    setFirstName,
    setLastName,
    setRole,
    toggleInterest,
  } = useProfileDraft();
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      Alert.alert("Not signed in", "Could not find your session.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        role,
        interests,
      })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      Alert.alert("Could not save changes", error.message);
      return;
    }

    router.back();
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ headerShown: true, title: "Edit Profile" }} />

      <Text style={styles.label}>First name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
        placeholder="Alex"
        placeholderTextColor={colors.placeholder}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Last name</Text>
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
        placeholder="Smith"
        placeholderTextColor={colors.placeholder}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Role</Text>
      <TextInput
        value={role}
        onChangeText={setRole}
        style={styles.input}
        placeholder="Product engineer @ Vercel"
        placeholderTextColor={colors.placeholder}
      />

      <Text style={styles.label}>Interests</Text>
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

      <Pressable
        style={[styles.saveButton, saving && { opacity: 0.6 }]}
        onPress={save}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? "Saving…" : "Save changes"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  label: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: colors.chip,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 0,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    textAlignVertical: "center",
  },
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
  saveButton: {
    marginTop: 28,
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontFamily: fonts.heading,
    fontWeight: "600",
    fontSize: 16,
    color: colors.white,
  },
});
