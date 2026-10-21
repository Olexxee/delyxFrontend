import React, { useEffect } from "react";
import { SocketProvider } from "@/api/socketRegistry";
import { ThemeProvider } from "@/theme/ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import {
  QueryClient,
} from "@tanstack/react-query";
import {
  PersistQueryClientProvider,
} from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { UserProvider } from "@/authContext/UserContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
      }}
    >
      <ThemeProvider>
        <UserProvider>
          <SocketProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </SocketProvider>
        </UserProvider>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}
