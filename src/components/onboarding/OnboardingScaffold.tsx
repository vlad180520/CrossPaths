import BrandMark from "@/components/BrandMark";
import ProgressDots from "@/components/onboarding/ProgressDots";
import { colors, fonts, radius } from "@/theme";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  step?: number;
  total?: number;
  buttonLabel: string;
  onNext: () => void;
  disabled?: boolean;
  isWelcome?: boolean;
  footnote?: string;
  children: React.ReactNode; // anything renderable (JSX, string, number, array of these, etc.)
};

/** Shared onboarding chrome: brand header, centered body, progress dots + primary CTA. */
export default function OnboardingScaffold({
  step,
  total,
  buttonLabel,
  onNext,
  disabled = false,
  isWelcome = false,
  footnote,
  children,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      <View
        style={[
          styles.root,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
        ]}
      >
        {!isWelcome && (
          <View style={styles.header}>
            <BrandMark size={22} />
            <Text style={styles.wordmark}>Cross Paths</Text>
          </View>
        )}

        <View style={styles.body}>{children}</View>

        {step !== undefined && total !== undefined && (
          <ProgressDots step={step} total={total} />
        )}

        <Pressable
          onPress={onNext}
          disabled={disabled}
          style={({ pressed }) => [
            styles.cta,
            { opacity: disabled ? 0.4 : pressed ? 0.92 : 1 },
          ]}
        >
          <Text style={styles.ctaText}>{buttonLabel}</Text>
        </Pressable>

        <Text style={styles.footnote}>{footnote ?? " "}</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 28 },
  header: { flexDirection: "row", alignItems: "center", gap: 9, height: 24 },
  wordmark: {
    fontFamily: fonts.heading,
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: -0.3,
    color: colors.ink,
  },
  body: { flex: 1, justifyContent: "center" },
  cta: {
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    shadowColor: colors.ink,
    shadowOpacity: 0.32,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  ctaText: {
    fontFamily: fonts.heading,
    fontWeight: "600",
    fontSize: 17,
    color: colors.white,
  },
  footnote: {
    textAlign: "center",
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.faint,
    marginTop: 14,
    minHeight: 16,
  },
});
