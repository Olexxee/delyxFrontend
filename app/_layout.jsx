import { useContext, useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { UserContext } from "@/authContext/UserContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user, restoreSession } = useContext(UserContext);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await restoreSession();
      setReady(true);
      await SplashScreen.hideAsync();
    };

    init();
  }, []);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="(auth)" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}
