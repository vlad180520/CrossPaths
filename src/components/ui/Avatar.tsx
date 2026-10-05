import { colors, fonts } from '@/theme';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  size?: number;
  initials: string;
  emoji?: string | null;
  color?: string | null;
};

export default function Avatar({ size = 52, initials, emoji, color }: Props) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color || colors.primary,
        },
      ]}
    >
      {emoji ? (
        <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.3 }]}>
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fonts.heading,
    fontWeight: '700',
    color: colors.white,
    textTransform: 'uppercase',
  },
});
