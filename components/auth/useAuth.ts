import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, registerUser } from "@/api/apiService";
import { mapApiUser } from "@/utils/mapUser";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import type { User } from "@/types/auth";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===================== LOGIN ===================== */
  const login = async (
    email: string,
    password: string,
    setUser: (user: User) => void
  ) => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await loginUser({ email, password });

      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);

      const mappedUser = mapApiUser(response.user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mappedUser));

      // Set user in context → UserProvider will handle device token automatically
      setUser(mappedUser);

      router.replace("/(tabs)/feed");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== REGISTER ===================== */
  const register = async (
    username: string,
    email: string,
    password: string,
    setUser: (user: User) => void
  ) => {
    if (!username || !email || !password) {
      setError("Username, email, and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await registerUser({ username, email, password });

      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);

      const mappedUser = mapApiUser(response.user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mappedUser));

      // Set user in context → UserProvider will handle device token automatically
      setUser(mappedUser);

      router.replace("/(tabs)/feed");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    login,
    register,
  };
}
