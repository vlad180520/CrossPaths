import { supabase } from "@/lib/supabase";
import { useProfileDraft } from "@/state/profile";
import { colors, fonts, radius } from "@/theme";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Stats = {
  totalEncounters: number;
  uniquePeople: number;
  topSharedInterest: string | null;
  longestStreak: number;
};

export default function StatsScreen() {
  const { interests: myInterests } = useProfileDraft();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: encounters } = await supabase
        .from("encounters")
        .select("crossed_with_id, seen_at")
        .eq("user_id", user.id);

      if (!encounters || encounters.length === 0) {
        setStats({
          totalEncounters: 0,
          uniquePeople: 0,
          topSharedInterest: null,
          longestStreak: 0,
        });
        setLoading(false);
        return;
      }

      const uniqueIds = Array.from(
        new Set(encounters.map((e) => e.crossed_with_id))
      );

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, interests")
        .in("user_id", uniqueIds);

      // Only count interests you also have — "shared," not just "common."
      const interestCounts = new Map<string, number>();
      for (const profile of profiles ?? []) {
        for (const interest of profile.interests ?? []) {
          if (!myInterests.includes(interest)) continue;
          interestCounts.set(interest, (interestCounts.get(interest) ?? 0) + 1);
        }
      }
      let topSharedInterest: string | null = null;
      let topCount = 0;
      for (const [interest, count] of interestCounts) {
        if (count > topCount) {
          topCount = count;
          topSharedInterest = interest;
        }
      }

      // Longest run of consecutive calendar days with at least one encounter.
      const days = Array.from(
        new Set(encounters.map((e) => new Date(e.seen_at).toDateString()))
      )
        .map((d) => new Date(d).getTime())
        .sort((a, b) => a - b);

      let longestStreak = 1;
      let current = 1;
      for (let i = 1; i < days.length; i++) {
        const dayDiff = Math.round((days[i] - days[i - 1]) / 86400000);
        if (dayDiff === 1) {
          current += 1;
          longestStreak = Math.max(longestStreak, current);
        } else {
          current = 1;
        }
      }

      setStats({
        totalEncounters: encounters.length,
        uniquePeople: uniqueIds.length,
        topSharedInterest,
        longestStreak,
      });
      setLoading(false);
    })();
  }, []);

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: true, title: "Stats" }} />

      {loading || !stats ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.ink} />
        </View>
      ) : (
        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.value}>{stats.uniquePeople}</Text>
            <Text style={styles.cardLabel}>people met</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.value}>{stats.totalEncounters}</Text>
            <Text style={styles.cardLabel}>total encounters</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.value}>{stats.longestStreak}</Text>
            <Text style={styles.cardLabel}>day streak</Text>
          </View>
          <View style={styles.card}>
            <Text style={[styles.value, styles.valueSmall]}>
              {stats.topSharedInterest ?? "—"}
            </Text>
            <Text style={styles.cardLabel}>top shared interest</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  card: {
    flexBasis: "47%",
    flexGrow: 1,
    backgroundColor: colors.chip,
    borderRadius: radius.lg,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 120,
  },
  value: {
    fontFamily: fonts.heading,
    fontWeight: "700",
    fontSize: 34,
    color: colors.ink,
    textAlign: "center",
  },
  valueSmall: { fontSize: 18 },
  cardLabel: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.muted,
    textAlign: "center",
  },
});
