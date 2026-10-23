import { createContext, ReactNode, useContext, useState } from "react";
import { DarkTheme, LightTheme, Theme } from "./theme";

type ThemeContextType = Theme & {
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Delyx opens in its intended dark gaming theme regardless of OS/browser settings.
  const [currentTheme, setCurrentTheme] = useState<Theme>(DarkTheme);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev.mode === "dark" ? LightTheme : DarkTheme));
  };

  return (
    <ThemeContext.Provider value={{ ...currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("useTheme must be used within ThemeProvider");
  return theme;
}
