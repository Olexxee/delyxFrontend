import { Stack } from "expo-router";
import { ThemeProvider } from "@/theme/ThemeProvider";

export default function AuthLayout() {

  return <Stack screenOptions={{ headerShown: false }} />;
}
