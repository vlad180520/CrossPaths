import React from 'react';
import { View } from 'react-native';
import { colors } from '@/theme';

/** The concentric-ring CrossPaths mark used in the onboarding header. */
export default function BrandMark({ size = 22 }: { size?: number }) {
  const bw = Math.max(1.5, size * 0.09);
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: bw,
          borderColor: colors.primary,
          opacity: 0.35,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.23,
          left: size * 0.23,
          width: size * 0.54,
          height: size * 0.54,
          borderRadius: size * 0.27,
          borderWidth: bw,
          borderColor: colors.primary,
          opacity: 0.6,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: size * 0.41,
          left: size * 0.41,
          width: size * 0.18,
          height: size * 0.18,
          borderRadius: size * 0.09,
          backgroundColor: colors.primary,
        }}
      />
    </View>
  );
}
