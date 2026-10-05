import PulseRings from "@/components/PulseRings";
import Popup from "@/components/ui/Popup";
import { colors, fonts, radius } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  firstName: string;
  role: string;
  interestsCount: number;
};

export default function WelcomePopup({
  visible,
  onClose,
  firstName,
  role,
  interestsCount,
}: Props) {
  return (
    <Popup visible={visible} onClose={onClose} variant="card">
      <PulseRings />

      <Ionicons
        name="checkmark-circle"
        size={32}
        color={colors.primary}
        style={{ marginTop: 20 }}
      />

      <Text style={styles.h1}>
        You&apos;re all set{firstName ? `, ${firstName}` : ""}!
      </Text>
      <Text style={styles.p}>
        {role || "Attendee"} · {interestsCount} interests · scanning starts
        now.
      </Text>

      <Pressable style={styles.cta} onPress={onClose}>
        <Text style={styles.ctaText}>Let&apos;s go</Text>
      </Pressable>
    </Popup>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontFamily: fonts.heading,
    fontWeight: "700",
    fontSize: 26,
    lineHeight: 30,
    color: colors.ink,
    textAlign: "center",
    marginTop: 10,
  },
  p: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    textAlign: "center",
    marginTop: 10,
  },
  cta: {
    marginTop: 28,
    width: "100%",
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontFamily: fonts.heading,
    fontWeight: "600",
    fontSize: 16,
    color: colors.white,
  },
});
