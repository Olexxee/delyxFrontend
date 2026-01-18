import { createContext, ReactNode, useContext } from "react";
import { DarkTheme, Theme } from "./theme";

const ThemeContext = createContext<Theme>(DarkTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={DarkTheme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
