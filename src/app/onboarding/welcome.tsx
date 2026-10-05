import OnboardingScaffold from "@/components/onboarding/OnboardingScaffold";
import PulseRings from "@/components/PulseRings";
import { colors, fonts } from "@/theme";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Welcome() {
  const router = useRouter();
  return (
    <OnboardingScaffold
      isWelcome={true}
      buttonLabel="Create your profile"
      onNext={() => router.push("/onboarding/name")}
    >
      <View>
        <View style={{ alignItems: "center" }}>
          <PulseRings />
        </View>
        <Text style={styles.h1}>Cross Paths</Text>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontFamily: fonts.heading,
    fontWeight: "600",
    fontSize: 34,
    lineHeight: 34,
    letterSpacing: -0.6,
    color: colors.ink,
    marginBottom: 14,
    textAlign: "center",
  },
  p: {
    fontFamily: fonts.body,
    fontSize: 15.5,
    lineHeight: 23,
    color: colors.muted2,
  },
});
