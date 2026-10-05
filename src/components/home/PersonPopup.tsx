import Avatar from '@/components/ui/Avatar';
import Popup from '@/components/ui/Popup';
import { colors, fonts, radius } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type Person = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  interests: string[];
  avatarEmoji?: string | null;
  avatarColor?: string | null;
};

type Props = {
  person: Person | null;
  onClose: () => void;
  /** The current user's own interests, used to highlight overlap. */
  myInterests?: string[];
  /** How many times you've crossed paths with this person, if known. */
  encounterCount?: number;
  isSaved?: boolean;
  onToggleSave?: () => void;
};

export default function PersonPopup({
  person,
  onClose,
  myInterests = [],
  encounterCount,
  isSaved,
  onToggleSave,
}: Props) {
  return (
    <Popup visible={!!person} onClose={onClose}>
      {person && (
        <>
          <View style={styles.header}>
            <Avatar
              initials={person.name.slice(0, 2)}
              emoji={person.avatarEmoji}
              color={person.avatarColor}
            />
            <View style={styles.headerText}>
              <Text style={styles.name}>{person.name}</Text>
              <Text style={styles.role}>{person.role}</Text>
              {!!encounterCount && (
                <Text style={styles.encounterCount}>
                  Crossed paths {encounterCount}{' '}
                  {encounterCount === 1 ? 'time' : 'times'}
                </Text>
              )}
            </View>
            {onToggleSave && (
              <Pressable onPress={onToggleSave} hitSlop={10}>
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={22}
                  color={colors.ink}
                />
              </Pressable>
            )}
          </View>

          {!!person.bio && <Text style={styles.bio}>{person.bio}</Text>}

          {person.interests.length > 0 && (
            <View style={styles.chips}>
              {person.interests.map((interest) => {
                const shared = myInterests.includes(interest);
                return (
                  <View
                    key={interest}
                    style={[styles.chip, shared && styles.chipShared]}
                  >
                    <Text
                      style={[styles.chipText, shared && styles.chipTextShared]}
                    >
                      {interest}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </>
      )}
    </Popup>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerText: { flex: 1, gap: 2 },
  name: {
    fontFamily: fonts.heading,
    fontWeight: '700',
    fontSize: 19,
    color: colors.ink,
  },
  role: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    color: colors.muted,
  },
  encounterCount: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  bio: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 21,
    color: colors.muted2,
    marginTop: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 13,
  },
  chipShared: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    fontWeight: '500',
    color: colors.muted2,
  },
  chipTextShared: {
    color: colors.white,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 22,
    height: 50,
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontFamily: fonts.heading,
    fontWeight: '600',
    fontSize: 15,
    color: colors.white,
  },
});
