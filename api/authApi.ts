import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

export async function registerUser(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);

  await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
  await AsyncStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(data.user)
  );

  return data;
}

export async function loginUser(
  payload: LoginPayload
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);

  await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
  await AsyncStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(data.user)
  );

  return data;
}

export async function logoutUser() {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.TOKEN,
    STORAGE_KEYS.USER,
  ]);
}
