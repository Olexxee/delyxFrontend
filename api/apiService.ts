import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/auth";
import axios from "axios";

const API_BASE_URL = "https://your-backend.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  // attach token later from storage if needed
  return config;
});

/* ================= AUTH ================= */

export async function registerUser(payload: RegisterPayload): Promise<User> {
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data.user; // must match User type
}

export async function loginUser(payload: LoginPayload): Promise<User> {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data.user; // must match User type
}

/* ================= OTHER ================= */

export async function getFeed() {
  const response = await api.get("/feed");
  return response.data;
}

export default api;
