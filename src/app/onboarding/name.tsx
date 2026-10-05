import OnboardingScaffold from "@/components/onboarding/OnboardingScaffold";
import { useProfileDraft } from "@/state/profile";
import { colors, fonts } from "@/theme";
import { useRouter } from "expo-router";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Name() {
  const router = useRouter();
  const { firstName, setFirstName, lastName, setLastName } = useProfileDraft();
  const canContinue = firstName.trim().length > 0 && lastName.trim().length > 0;
  return (
    <OnboardingScaffold
      step={0}
      total={3}
      isWelcome={false}
      buttonLabel="Continue"
      disabled={!canContinue}
      onNext={() => router.push("/onboarding/role")}
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
        <Text style={styles.prompt}>What&apos;s your name?</Text>
        <View style={styles.nameBox}>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Alex"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="words"
            returnKeyType="next"
            style={styles.input}
          />
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Smith"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={() =>
              canContinue && router.push("/onboarding/role")
            }
            style={styles.input}
          />
        </View>
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
    fontWeight: "600",
    fontSize: 42,
    lineHeight: 48,
    letterSpacing: -1.2,
    color: colors.ink,
  },
  nameBox: {
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
});
