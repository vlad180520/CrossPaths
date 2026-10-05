import PersonPopup, { type Person } from "@/components/home/PersonPopup";
import Avatar from "@/components/ui/Avatar";
import { supabase } from "@/lib/supabase";
import { useProfileDraft } from "@/state/profile";
import { colors, fonts } from "@/theme";
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
};

export default function SavedPeople() {
  const { interests: myInterests } = useProfileDraft();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Row | null>(null);

  const load = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: saved } = await supabase
      .from("saved_people")
      .select("saved_user_id");
    const ids = (saved ?? []).map((s) => s.saved_user_id);

    if (ids.length === 0) {
      setRows([]);
      setLoading(false);
      return;
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select(
        "user_id, first_name, last_name, role, interests, avatar_emoji, avatar_color"
      )
      .in("user_id", ids);

    setRows(
      (profiles ?? []).map((p) => ({
        userId: p.user_id,
        name: `${p.first_name} ${p.last_name}`.trim(),
        role: p.role,
        interests: p.interests ?? [],
        avatarEmoji: p.avatar_emoji,
        avatarColor: p.avatar_color,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const unsave = async (userId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setRows((prev) => prev.filter((r) => r.userId !== userId));
    setSelected(null);

    await supabase
      .from("saved_people")
      .delete()
      .eq("user_id", user.id)
      .eq("saved_user_id", userId);
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
      <Stack.Screen options={{ headerShown: true, title: "Saved" }} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.ink} />
        </View>
      ) : rows.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            No saved people yet — bookmark someone from their profile to see
            them here.
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
                <Text style={styles.meta}>{item.role || "Attendee"}</Text>
              </View>
            </Pressable>
          )}
        />
      )}

      <PersonPopup
        person={selectedPerson}
        onClose={() => setSelected(null)}
        myInterests={myInterests}
        isSaved
        onToggleSave={selected ? () => unsave(selected.userId) : undefined}
      />
    </View>
  );
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
