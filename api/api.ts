import { STORAGE_KEYS } from "@/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Set EXPO_PUBLIC_API_URL to the deployed backend origin (without /api suffix).
// The backend mounts routes at /api/*, not /api/v1/*.
export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? ""
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      (error.code === "ECONNABORTED"
        ? "The server took too long to respond. Please try again."
        : error.message) ??
      "Request failed";
    return Promise.reject(new Error(message));
  },
);

export default api;
