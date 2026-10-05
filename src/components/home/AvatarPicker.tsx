import Avatar from '@/components/ui/Avatar';
import Popup from '@/components/ui/Popup';
import { supabase } from '@/lib/supabase';
import { colors, fonts, radius } from '@/theme';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

const EMOJI_OPTIONS = [
  '😀', '😎', '🤓', '🚀', '🎨', '☕', '🐱', '🌟',
  '🔥', '🎧', '🏃', '📚', '🎮', '🌈', '🦄', '⚡',
];

const COLOR_OPTIONS = [
  '#c98a3c', '#5648e0', '#1fae8e', '#e8617e',
  '#2fa98b', '#1c2b3a', '#c94f4f', '#3f7cac',
];

type Props = {
  visible: boolean;
  onClose: () => void;
  initials: string;
  currentEmoji: string | null;
  currentColor: string | null;
  onSaved: (emoji: string | null, color: string | null) => void;
};

export default function AvatarPicker({
  visible,
  onClose,
  initials,
  currentEmoji,
  currentColor,
  onSaved,
}: Props) {
  const [emoji, setEmoji] = useState(currentEmoji);
  const [color, setColor] = useState(currentColor ?? COLOR_OPTIONS[0]);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_emoji: emoji, avatar_color: color })
        .eq('user_id', user.id);

      if (error) {
        setSaving(false);
        Alert.alert('Could not save avatar', error.message);
        return;
      }
    }

    setSaving(false);
    onSaved(emoji, color);
    onClose();
  };

  return (
    <Popup visible={visible} onClose={onClose} variant="card">
      <Avatar size={72} initials={initials} emoji={emoji} color={color} />

      <Text style={styles.label}>Emoji</Text>
      <View style={styles.emojiGrid}>
        {EMOJI_OPTIONS.map((option) => (
          <Pressable
            key={option}
            onPress={() => setEmoji(option === emoji ? null : option)}
            style={[
              styles.emojiCell,
              option === emoji && styles.emojiCellSelected,
            ]}
          >
            <Text style={styles.emojiText}>{option}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Color</Text>
      <View style={styles.colorRow}>
        {COLOR_OPTIONS.map((option) => (
          <Pressable
            key={option}
            onPress={() => setColor(option)}
            style={[
              styles.colorSwatch,
              { backgroundColor: option },
              option === color && styles.colorSwatchSelected,
            ]}
          />
        ))}
      </View>

      <Pressable style={styles.saveButton} onPress={save} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? 'Saving…' : 'Save'}</Text>
      </Pressable>
    </Popup>
  );
}

const styles = StyleSheet.create({
  label: {
    alignSelf: 'flex-start',
    fontFamily: fonts.body,
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 24,
    marginBottom: 10,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  emojiCell: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiCellSelected: {
    backgroundColor: colors.primarySoft,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  emojiText: { fontSize: 20 },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: colors.ink,
  },
  saveButton: {
    marginTop: 26,
    width: '100%',
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontFamily: fonts.heading,
    fontWeight: '600',
    fontSize: 16,
    color: colors.white,
  },
});
