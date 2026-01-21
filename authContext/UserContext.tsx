import { STORAGE_KEYS } from "@/constants/storageKeys";
import type { User } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useEffect, useState } from "react";
import messaging from "@react-native-firebase/messaging";
import api from "@/api/api";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  restoreSession: () => Promise<void>;
  isRestoring: boolean;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  restoreSession: async () => {},
  isRestoring: false,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  // Save device token and listen for refresh
  const handleDeviceToken = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      if (
        authStatus !== messaging.AuthorizationStatus.AUTHORIZED &&
        authStatus !== messaging.AuthorizationStatus.PROVISIONAL
      ) return;

      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await api.post("/auth/save-device-token", { deviceToken: fcmToken });
      }

      messaging().onTokenRefresh(async (newToken) => {
        try {
          await api.post("/auth/save-device-token", { deviceToken: newToken });
          console.log("Device token refreshed:", newToken);
        } catch (err) {
          console.error("Failed to refresh device token:", err);
        }
      });
    } catch (err) {
      console.error("Failed to save device token:", err);
    }
  };

  async function restoreSession() {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        setUser(JSON.parse(storedUser));

        // User is logged in → set up device token
        await handleDeviceToken();
      }
    } finally {
      setIsRestoring(false);
    }
  }

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, restoreSession, isRestoring }}
    >
      {children}
    </UserContext.Provider>
  );
}
