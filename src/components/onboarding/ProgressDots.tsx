import { colors } from "@/theme";
import { View } from "react-native";

export default function ProgressDots({
  step,
  total,
}: {
  step: number;
  total: number;
}) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 7 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            height: 6,
            borderRadius: 100,
            width: i === step ? 22 : 6,
            backgroundColor: i === step ? colors.primary : colors.dot,
          }}
        />
      ))}
    </View>
  );
}
