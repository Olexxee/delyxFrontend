import { useState } from "react";
import { useRouter } from "expo-router";
import { loginUser, registerUser } from "@/api/apiService";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email: string, password: string, setUser: any) => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await loginUser({ email, password });
      setUser(user);
      router.push("/(tabs)/feed"); // navigate to feed
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    setUser: any
  ) => {
    if (!username || !email || !password) {
      setError("Username, email, and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await registerUser({ username, email, password });
      setUser(user);
      router.push("/(tabs)/feed"); // navigate to feed
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, login, register };
}
