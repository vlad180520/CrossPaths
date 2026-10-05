import { colors } from "@/theme";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

/** One expanding + fading ring, looping forever. Mirrors the CSS `cpPulse` keyframe. */
function Ring({ delay }: { delay: number }) {
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 3200, easing: Easing.out(Easing.ease) }),
        -1,
        false,
      ),
    );
  }, [delay, p]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 0.32 + p.value * 0.68 }],
    // fade out over the first 70% of the cycle, then hold at 0
    opacity: p.value < 0.7 ? 0.5 * (1 - p.value / 0.7) : 0,
  }));

  return <Animated.View pointerEvents="none" style={[styles.ring, style]} />;
}

export default function PulseRings({ size = 196 }: { size?: number }) {
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {[0, 1, 2].map((i) => (
        <Ring key={i} delay={i * 1050} />
      ))}
      <View style={styles.core}>
        <View style={styles.coreRingOuter} />
        <View style={styles.coreRingInner} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  ring: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  core: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  coreRingOuter: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  coreRingInner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.65)",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.white,
  },
});
