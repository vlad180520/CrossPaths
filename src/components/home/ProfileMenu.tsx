import Avatar from '@/components/ui/Avatar';
import Popup from '@/components/ui/Popup';
import { colors, fonts, radius } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  firstName: string;
  lastName: string;
  role: string;
  interests: string[];
  avatarEmoji: string | null;
  avatarColor: string | null;
  onEditAvatar: () => void;
};

export default function ProfileMenu({
  visible,
  onClose,
  firstName,
  lastName,
  role,
  interests,
  avatarEmoji,
  avatarColor,
  onEditAvatar,
}: Props) {
  const router = useRouter();

  const go = (path: Parameters<typeof router.push>[0]) => {
    onClose();
    router.push(path);
  };

  const menuItems: {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    onPress: () => void;
  }[] = [
    {
      icon: 'people-outline',
      label: "People you've crossed paths with",
      onPress: () => go('/history'),
    },
    { icon: 'bookmark-outline', label: 'Saved', onPress: () => go('/saved-people') },
    { icon: 'stats-chart-outline', label: 'Stats', onPress: () => go('/stats') },
    { icon: 'create-outline', label: 'Edit profile', onPress: () => go('/edit-profile') },
    { icon: 'settings-outline', label: 'Settings', onPress: () => go('/settings') },
    {
      icon: 'information-circle-outline',
      label: 'About',
      onPress: () => go('/about'),
    },
  ];

  return (
    <Popup visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Pressable onPress={onEditAvatar}>
          <Avatar
            initials={`${firstName.slice(0, 1)}${lastName.slice(0, 1)}` || '?'}
            emoji={avatarEmoji}
            color={avatarColor}
          />
          <View style={styles.editBadge}>
            <Ionicons name="pencil" size={11} color={colors.white} />
          </View>
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.name}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.role}>{role || 'Attendee'}</Text>
        </View>
      </View>

      {interests.length > 0 && (
        <View style={styles.chips}>
          {interests.map((interest) => (
            <View key={interest} style={styles.chip}>
              <Text style={styles.chipText}>{interest}</Text>
            </View>
          ))}
        </View>
      )}

      {menuItems.map((item) => (
        <Pressable key={item.label} style={styles.row} onPress={item.onPress}>
          <Ionicons name={item.icon} size={18} color={colors.ink} />
          <Text style={styles.rowText}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>
      ))}

      <Pressable style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </Pressable>
    </Popup>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.ink,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
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
  chipText: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    fontWeight: '500',
    color: colors.muted2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.chip,
    borderRadius: radius.md,
  },
  rowText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14.5,
    fontWeight: '600',
    color: colors.ink,
  },
  closeButton: {
    marginTop: 12,
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
