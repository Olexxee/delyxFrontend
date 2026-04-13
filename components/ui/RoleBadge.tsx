import React from "react";
import { PillBadge } from "./Badge";
import { useTheme } from "@/theme/ThemeProvider";
import type { CanonicalRole } from "@/view-models/group.vm";

type RoleBadgeProps = {
  role: CanonicalRole | null;
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const { colors } = useTheme();

  if (!role || role === "member") return null;

  return (
    <PillBadge
      label={role}
      backgroundColor={colors.surfaceLight}
      textColor={colors.textSecondary}
    />
  );
}
