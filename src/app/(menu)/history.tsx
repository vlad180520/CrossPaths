import PersonPopup, { type Person } from "@/components/home/PersonPopup";
import Avatar from "@/components/ui/Avatar";
import { supabase } from "@/lib/supabase";
import { useProfileDraft } from "@/state/profile";
import { colors, fonts } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Row = {
  userId: string;
  name: string;
  role: string;
  interests: string[];
  avatarEmoji: string | null;
  avatarColor: string | null;
  count: number;
  lastSeen: string;
};

export default function History() {
  const { interests: myInterests } = useProfileDraft();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Row | null>(null);

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
        .eq("user_id", user.id)
        .order("seen_at", { ascending: false });

      // Group individual sightings into one row per person — first time we
      // see an id is the most recent, since encounters is already sorted.
      const grouped = new Map<string, { count: number; lastSeen: string }>();
      for (const e of encounters ?? []) {
        const existing = grouped.get(e.crossed_with_id);
        if (existing) existing.count += 1;
        else grouped.set(e.crossed_with_id, { count: 1, lastSeen: e.seen_at });
      }

      const ids = Array.from(grouped.keys());

      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      const [{ data: profiles }, { data: saved }] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "user_id, first_name, last_name, role, interests, avatar_emoji, avatar_color"
          )
          .in("user_id", ids),
        supabase.from("saved_people").select("saved_user_id"),
      ]);

      setSavedIds(new Set((saved ?? []).map((s) => s.saved_user_id)));

      const combined: Row[] = ids
        .map((id) => {
          const profile = profiles?.find((p) => p.user_id === id);
          const meta = grouped.get(id)!;
          if (!profile) return null;
          return {
            userId: id,
            name: `${profile.first_name} ${profile.last_name}`.trim(),
            role: profile.role,
            interests: profile.interests ?? [],
            avatarEmoji: profile.avatar_emoji,
            avatarColor: profile.avatar_color,
            count: meta.count,
            lastSeen: meta.lastSeen,
          };
        })
        .filter((r): r is Row => r !== null);

      setRows(combined);
      setLoading(false);
    })();
  }, []);

  const toggleSave = async (userId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const next = new Set(savedIds);
    if (next.has(userId)) {
      next.delete(userId);
      setSavedIds(next);
      await supabase
        .from("saved_people")
        .delete()
        .eq("user_id", user.id)
        .eq("saved_user_id", userId);
    } else {
      next.add(userId);
      setSavedIds(next);
      await supabase
        .from("saved_people")
        .insert({ user_id: user.id, saved_user_id: userId });
    }
  };

  const selectedPerson: Person | null = selected
    ? {
        id: selected.userId,
        name: selected.name,
        role: selected.role,
        interests: selected.interests,
        avatarEmoji: selected.avatarEmoji,
        avatarColor: selected.avatarColor,
      }
    : null;

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: true, title: "People" }} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.ink} />
        </View>
      ) : rows.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            No one yet — once CrossPaths finds someone nearby, they&apos;ll
            show up here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(row) => row.userId}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => setSelected(item)}>
              <Avatar
                size={44}
                initials={item.name.slice(0, 2)}
                emoji={item.avatarEmoji}
                color={item.avatarColor}
              />
              <View style={styles.rowText}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.count} {item.count === 1 ? "time" : "times"} ·{" "}
                  {timeAgo(item.lastSeen)}
                </Text>
              </View>
              {savedIds.has(item.userId) && (
                <Ionicons name="bookmark" size={18} color={colors.primary} />
              )}
            </Pressable>
          )}
        />
      )}

      <PersonPopup
        person={selectedPerson}
        onClose={() => setSelected(null)}
        myInterests={myInterests}
        encounterCount={selected?.count}
        isSaved={selected ? savedIds.has(selected.userId) : false}
        onToggleSave={
          selected ? () => toggleSave(selected.userId) : undefined
        }
      />
    </View>
  );
}

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 21,
    color: colors.muted,
    textAlign: "center",
  },
  list: { padding: 16, gap: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.chip,
    borderRadius: 14,
    padding: 12,
  },
  rowText: { flex: 1, gap: 2 },
  name: {
    fontFamily: fonts.heading,
    fontWeight: "700",
    fontSize: 15.5,
    color: colors.ink,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.muted,
  },
});
