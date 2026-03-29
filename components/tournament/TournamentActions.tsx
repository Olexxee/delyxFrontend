import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface TournamentActionsProps {
  canJoin: boolean;
  onJoin?: () => void;
  onView?: () => void;
}

export default function TournamentActions({
  canJoin,
  onJoin,
  onView,
}: TournamentActionsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      {canJoin ? (
        <Pressable
          onPress={onJoin}
          disabled={!onJoin}
          style={[
            styles.joinBtn,
            {
              backgroundColor: colors.accent,
              opacity: onJoin ? 1 : 0.6,
            },
          ]}
        >
          <Text style={styles.joinBtnText}>Join</Text>
        </Pressable>
      ) : null}

      <Pressable
        onPress={onView}
        disabled={!onView}
        style={[
          styles.viewBtn,
          {
            borderColor: colors.border,
            opacity: onView ? 1 : 0.6,
          },
        ]}
      >
        <Text style={[styles.viewBtnText, { color: colors.accent }]}>
          View
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
  },
  joinBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  viewBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  viewBtnText: {
    fontWeight: "600",
    fontSize: 14,
  },
});