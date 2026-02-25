export const DarkColors = {
  background: "#0B0E13",
  surface: "#11151C",
  surfaceLight: "#1A1F2E",
  primary: "#5B8CFF",
  accent: "#22C55E",
  danger: "#EF4444",
  warning: "#F59E0B",
  error: "#EF4444",
  messageSent: "#7C5CFC",
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
  border: "#1F2937",
  borderLight: "#343A55",
  status: "#6B7280",
  medal: "#FFD700",
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#FFD700",
} as const;

export const LightColors = {
  background: "#FFFFFF",
  surface: "#F8FAFC",
  surfaceLight: "#E2E8F0",
  primary: "#1E40AF", // Darker blue for contrast on light
  accent: "#16A34A",
  danger: "#DC2626",
  warning: "#D97706",
  error: "#DC2626",
  messageSent: "#7C3AED", // Darker purple
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  border: "#CBD5E1",
  borderLight: "#94A3B8",
  status: "#475569",
  medal: "#EAD500",
  bronze: "#B45309",
  silver: "#6B7280",
  gold: "#EAD500",
} as const;

export type ColorsType = typeof DarkColors;
export type ColorTypeLight = typeof LightColors;

export type ThemeColors = ColorsType | ColorTypeLight;
