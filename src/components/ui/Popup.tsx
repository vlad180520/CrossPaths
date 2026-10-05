import { colors, radius } from "@/theme";
import React from "react";
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  /** "sheet" is anchored to the bottom (default). "card" is centered. Both fade in. */
  variant?: "sheet" | "card";
  children: React.ReactNode;
};

export default function Popup({
  visible,
  onClose,
  variant = "sheet",
  children,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={[styles.backdrop, variant === "card" && styles.backdropCard]}
        onPress={onClose}
      >
        {variant === "sheet" ? (
          <Pressable style={styles.sheetOuter} onPress={(e) => e.stopPropagation()}>
            <ScrollView
              style={styles.sheetScroll}
              contentContainerStyle={styles.sheet}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </Pressable>
        ) : (
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            {children}
          </Pressable>
        )}
      </Pressable>
    </Modal>
  );
}

const MAX_SHEET_HEIGHT = Dimensions.get("window").height * 0.85;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  backdropCard: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  sheetOuter: {
    maxHeight: MAX_SHEET_HEIGHT,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  sheetScroll: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  sheet: {
    padding: 24,
    paddingBottom: 36,
  },
  card: {
    width: "100%",
    backgroundColor: colors.bg,
    borderRadius: radius.xl,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: "center",
  },
});
