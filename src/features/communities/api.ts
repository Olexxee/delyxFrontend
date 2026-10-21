import api from "@/api/api";

export type Community = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  image?: string | null;
  avatar?: string | null;
  visibility?: "PUBLIC" | "PRIVATE" | string;
  memberCount?: number;
  membersCount?: number;
  isMember?: boolean;
  owner?: { id: string; username?: string };
};

type ApiEnvelope<T> = { success: boolean; data: T; message?: string };
type CommunityListPayload =
  | Community[]
  | {
      data?: Community[];
      pagination?: { total: number; limit: number; offset: number; hasMore?: boolean };
    };

const normalizeCommunity = (community: Community): Community => ({
  ...community,
  imageUrl: community.imageUrl ?? community.image ?? community.avatar ?? null,
  memberCount: community.memberCount ?? community.membersCount ?? 0,
});

export async function listCommunities(search = ""): Promise<Community[]> {
  const { data } = await api.get<ApiEnvelope<CommunityListPayload>>("/api/community", {
    params: { limit: 50, offset: 0, ...(search.trim() ? { search: search.trim() } : {}) },
  });

  if (!data.success) {
    throw new Error(data.message || "The server could not load communities.");
  }

  // The backend currently wraps the paginated result as data: { data: [], pagination: {} }.
  // Accept the flat-array form too so a future API response-shape change won't blank the screen.
  const payload = data.data;
  const communities = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : null;

  if (!communities) {
    throw new Error(data.message || "The server returned an invalid community list.");
  }

  return communities.map(normalizeCommunity);
}

export async function createCommunity(input: {
  name: string;
  description?: string;
  image?: string | null;
}): Promise<Community> {
  const { data } = await api.post<ApiEnvelope<Community>>("/api/community", input);
  if (!data.success || !data.data) throw new Error(data.message || "Could not create community.");
  return normalizeCommunity(data.data);
}

export async function joinCommunity(id: string): Promise<void> {
  await api.post<ApiEnvelope<unknown>>(`/api/community/${encodeURIComponent(id)}/join`);
}

export async function leaveCommunity(id: string): Promise<void> {
  await api.post<ApiEnvelope<unknown>>(`/api/community/${encodeURIComponent(id)}/leave`);
}
