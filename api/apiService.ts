import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types/auth";
import api from "./api";

/* ================= AUTH ================= */

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/auth/signin", payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Login failed");
  }
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/auth/signup", payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Registration failed");
  }
}

/* ================= OTHER ================= */

export async function getFeed() {
  try {
    const response = await api.get("/feed");
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch feed");
  }
}

// Group related APIs can be added here similarly
export async function getMyGroups() {
  try {
    const response = await api.get("/groups/my-groups");
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch groups");
  }
}

export default api;
