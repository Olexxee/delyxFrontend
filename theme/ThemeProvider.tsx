import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { DarkTheme, LightTheme, Theme } from "./theme";

type ThemeContextType = Theme & {
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    systemScheme === "dark" ? DarkTheme : LightTheme
  );

  useEffect(() => {
    setCurrentTheme(systemScheme === "dark" ? DarkTheme : LightTheme);
  }, [systemScheme]);

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