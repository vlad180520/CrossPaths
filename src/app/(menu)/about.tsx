import BrandMark from "@/components/BrandMark";
import { colors, fonts } from "@/theme";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function About() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ headerShown: true, title: "About" }} />

      <View style={styles.header}>
        <BrandMark size={36} />
        <Text style={styles.wordmark}>CrossPaths</Text>
      </View>

      <Text style={styles.p}>
        CrossPaths helps you remember the people you meet in person, at
        conferences, events, or just around town.
      </Text>

      <Text style={styles.h2}>How it works</Text>
      <Text style={styles.p}>
        When two people running CrossPaths are near each other, the app logs it
        as a crossed path. Later, you can look back at everyone you've met, see
        what interests you share, and save the people you want to stay in touch
        with.
      </Text>

      <Text style={styles.h2}>Your data</Text>
      <Text style={styles.p}>
        Your profile (name, role, and interests) is visible to people you've
        crossed paths with, so they can recognize you too. The location of each
        encounter is stored so your map can show where you've met people.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  wordmark: {
    fontFamily: fonts.heading,
    fontWeight: "700",
    fontSize: 22,
    color: colors.ink,
  },
  h2: {
    fontFamily: fonts.heading,
    fontWeight: "700",
    fontSize: 16,
    color: colors.ink,
    marginTop: 22,
    marginBottom: 8,
  },
  p: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.muted2,
  },
});