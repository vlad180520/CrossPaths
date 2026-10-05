import OnboardingScaffold from "@/components/onboarding/OnboardingScaffold";
import { useProfileDraft } from "@/state/profile";
import { colors, fonts } from "@/theme";
import { useRouter } from "expo-router";
import { Keyboard, Pressable, StyleSheet, Text, TextInput } from "react-native";

export default function Role() {
  const router = useRouter();
  const { role, setRole } = useProfileDraft();
  return (
    <OnboardingScaffold
      step={1}
      total={3}
      isWelcome={false}
      buttonLabel="Continue"
      onNext={() => router.push("/onboarding/interests")}
    >
      <Pressable
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={Keyboard.dismiss}
      >
        <Text style={styles.prompt}>What do you do?</Text>
        <TextInput
          value={role}
          onChangeText={setRole}
          placeholder="Product engineer @ Vercel"
          placeholderTextColor={colors.placeholder}
          returnKeyType="next"
          onSubmitEditing={() => router.push("/onboarding/interests")}
          style={styles.input}
        />
      </Pressable>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  prompt: {
    fontFamily: fonts.body,
    fontSize: 15.5,
    color: colors.muted,
    marginBottom: 22,
  },
  input: {
    width: "100%",
    textAlign: "center",
    fontFamily: fonts.heading,
    fontWeight: "500",
    fontSize: 26,
    lineHeight: 31,
    letterSpacing: -0.5,
    color: colors.ink,
  },
});
