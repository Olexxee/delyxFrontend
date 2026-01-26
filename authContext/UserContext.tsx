import { STORAGE_KEYS } from "@/constants/storageKeys";
import type { User } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useEffect, useState } from "react";

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

  async function restoreSession() {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } finally {
      setIsRestoring(false);
    }
  }

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, restoreSession, isRestoring }}>
      {children}
    </UserContext.Provider>
  );
}
