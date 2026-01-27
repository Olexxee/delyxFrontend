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

export async function createGroup(name: string, image: string, privacy: string) {
  try {
    const response = await api.post("/groups/create", { name, image, privacy });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create group");
  }
}

// CHAT related APIs can be added here similarly
export async function getChatMessages(chatRoomId: string) {
  try {
    const response = await api.get(`/chat/messages/${chatRoomId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch chat messages");
  }
}

export async function getGroupAESKey(chatRoomId: string) {
  try {
    const response = await api.get(`/chat/room/${chatRoomId}/key`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch AES key");
  }
}

