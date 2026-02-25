import { ColorsType, DarkColors, LightColors } from "./color";

export type Theme = {
  colors: ColorsType;
  mode: "light" | "dark";
};

export const DarkTheme: Theme = {
  colors: DarkColors as ColorsType,
  mode: "dark",
};

export const LightTheme: Theme = {
  colors: LightColors as unknown as ColorsType,
  mode: "light",
};