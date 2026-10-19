import api from "@/api/api";

export type Community = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  avatar?: string | null;
  visibility?: "PUBLIC" | "PRIVATE" | string;
  memberCount?: number;
  membersCount?: number;
  isMember?: boolean;
  owner?: { id: string; username?: string };
};

type ApiEnvelope<T> = { success: boolean; data: T; message?: string };

export async function listCommunities(search = ""): Promise<Community[]> {
  const { data } = await api.get<ApiEnvelope<Community[]>>("/api/community", {
    params: { limit: 30, offset: 0, ...(search.trim() ? { search: search.trim() } : {}) },
  });
  if (!data.success || !Array.isArray(data.data)) {
    throw new Error(data.message || "The server returned an invalid community list.");
  }
  return data.data;
}

export async function createCommunity(input: {
  name: string;
  description?: string;
  visibility?: "PUBLIC" | "PRIVATE";
}): Promise<Community> {
  const { data } = await api.post<ApiEnvelope<Community>>("/api/community", input);
  if (!data.success || !data.data) throw new Error(data.message || "Could not create community.");
  return data.data;
}

export async function joinCommunity(id: string): Promise<void> {
  await api.post<ApiEnvelope<unknown>>(`/api/community/${encodeURIComponent(id)}/join`);
}

export async function leaveCommunity(id: string): Promise<void> {
  await api.post<ApiEnvelope<unknown>>(`/api/community/${encodeURIComponent(id)}/leave`);
}
