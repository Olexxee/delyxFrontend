import { STORAGE_KEYS } from "@/constants/storageKeys";
import type { User } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  restoreSession: () => Promise<void>;
  isRestoring: boolean;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);

export interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = (props) => {
  const { children } = props;

  const [user, setUser] = useState<User | null>(null);
  const [isRestoring, setIsRestoring] = useState<boolean>(true);

  const restoreSession = useCallback(async (): Promise<void> => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } finally {
      setIsRestoring(false);
    }
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const contextValue: UserContextType = useMemo(() => ({
    user,
    setUser,
    restoreSession,
    isRestoring,
  }), [user, setUser, restoreSession, isRestoring]);

  return React.createElement(
    UserContext.Provider,
    { value: contextValue },
    children
  );
};
