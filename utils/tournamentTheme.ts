import type { ThemeColors } from "@/theme/color";
import type { TournamentStatus } from "@/types/tournament";

export const getTournamentStatusColor = (
  status: TournamentStatus,
  colors: ThemeColors
) => {
  switch (status) {
    case "registration":
      return colors.primary;
    case "upcoming":
      return colors.warning;
    case "ongoing":
      return colors.accent;
    case "completed":
      return colors.status;
  }
};

export const getTournamentTokens = (colors: ThemeColors) => ({
  screenBg: colors.background,
  heroBg: colors.surface,
  sectionBg: colors.surfaceLight,
  border: colors.border,
  borderStrong: colors.borderLight,
  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  success: colors.accent,
  danger: colors.danger,
  warning: colors.warning,
  primary: colors.primary,
  winner: colors.gold,
});