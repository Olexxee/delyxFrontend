import React from "react";
import { StyleSheet, View } from "react-native";
import { AppButton } from "@/components/ui/AppButton";

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
  return (
    <View style={styles.row}>
      {canJoin && onJoin ? (
        <AppButton
          label="Join"
          onPress={onJoin}
          variant="primary"
          style={styles.button}
        />
      ) : null}
      {onView ? (
        <AppButton
          label="View"
          onPress={onView}
          variant="ghost"
          style={styles.button}
        />
      ) : null}
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
  button: {
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
});
