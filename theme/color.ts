export const DarkColors = {
  // Delyx competitive-gaming palette: midnight navy, electric blue, and acid lime.
  background: "#090D18",
  surface: "#111827",
  surfaceLight: "#1B263B",
  primary: "#4F7CFF",
  accent: "#C7F464",
  danger: "#FF5D73",
  warning: "#FFBF5F",
  error: "#FF5D73",
  messageSent: "#345DDF",
  textPrimary: "#F8FAFC",
  textSecondary: "#9AA8BE",
  border: "#253148",
  borderLight: "#3A4964",
  status: "#7C8AA5",
  medal: "#F6C85F",
  bronze: "#CD8B52",
  silver: "#C8D2E2",
  gold: "#F6C85F",
} as const;

export const LightColors = {
  background: "#F3F6FB",
  surface: "#FFFFFF",
  surfaceLight: "#E7EDF7",
  primary: "#315FE8",
  accent: "#416D0B",
  danger: "#D92D4B",
  warning: "#9A5B00",
  error: "#D92D4B",
  messageSent: "#345DDF",
  textPrimary: "#101827",
  textSecondary: "#58677F",
  border: "#D8E0ED",
  borderLight: "#B5C2D6",
  status: "#53627A",
  medal: "#A87800",
  bronze: "#995A2D",
  silver: "#64748B",
  gold: "#A87800",
} as const;

export type ColorsType = typeof DarkColors;
export type ColorTypeLight = typeof LightColors;

export type ThemeColors = ColorsType | ColorTypeLight;
