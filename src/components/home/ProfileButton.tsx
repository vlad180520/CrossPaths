import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  top: number;
  onPress: () => void;
  emoji?: string | null;
  color?: string | null;
};

export default function ProfileButton({ top, onPress, emoji, color }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { top, backgroundColor: color || colors.primary }]}
    >
      {emoji ? (
        <Text style={styles.emoji}>{emoji}</Text>
      ) : (
        <Ionicons name="person-outline" size={20} color={colors.white} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.ink,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  emoji: {
    fontSize: 18,
  },
});
