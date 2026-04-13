import React from "react";
import { PillBadge } from "./Badge";
import { useTheme } from "@/theme/ThemeProvider";

type TournamentStatusBadgeProps = {
  status?: string | null;
};

export function TournamentStatusBadge({ status }: TournamentStatusBadgeProps) {
  const { colors } = useTheme();

  if (!status) return null;

  const normalized = status.toLowerCase();

  const backgroundColor =
    normalized === "ongoing"
      ? colors.primary
      : normalized === "registration"
        ? colors.accent
        : normalized === "upcoming"
          ? colors.warning
          : colors.surfaceLight;

  const textColor = normalized === "completed" ? colors.textSecondary : "#fff";

  return (
    <PillBadge
      label={status}
      backgroundColor={backgroundColor}
      textColor={textColor}
    />
  );
}
