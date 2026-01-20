import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/auth";
import axios from "axios";

const API_BASE_URL = "https://hard-power.outray.app/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  // attach token later from storage if needed
  return config;
});

/* ================= AUTH ================= */

export async function loginUser(payload: LoginPayload): Promise<User> {
  try {
    console.log("Logging in with payload:", payload);
    const response = await api.post<AuthResponse>('/auth/signin', payload);
    return response.data.user;
  } catch (error: any) {
    // error.message comes from the Axios interceptor
     throw new Error(
      error.response?.data?.message || error.message || 'Registration failed'
    );
  }
}

export async function registerUser(payload: RegisterPayload): Promise<User> {
  try {
    const response = await api.post<AuthResponse>('/auth/signup', payload);
    return response.data.user;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || 'Registration failed'
    );
  }
}


/* ================= OTHER ================= */

export async function getFeed() {
  try {
    const response = await api.get('/feed');
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch feed');
  }
}

export default api;
