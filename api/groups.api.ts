import type {
  GroupOverview,
  MyGroupItem,
} from "@/types/group";
import { useQuery } from "@tanstack/react-query";
import api from "./api";
import type { GroupHub } from "@/types/groupHub";

type ApiEnvelope<T> = { success: boolean; data: T; message?: string };
type CommunityRecord = {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  memberCount?: number;
  isMember?: boolean;
  userRole?: string | null;
  members?: Array<{ id: string; username?: string; avatar?: string | null; role?: string }>;
};

const role = (value?: string | null): "owner" | "admin" | "member" | null => {
  const normalized = value?.toLowerCase();
  return normalized === "owner" || normalized === "admin" || normalized === "member" ? normalized : null;
};

const asGroupOverview = (community: CommunityRecord): GroupOverview => ({
  id: community.id,
  name: community.name,
  avatar: community.image ?? null,
  privacy: "public",
  totalMembers: community.memberCount ?? community.members?.length ?? 0,
  chatRoomId: community.id,
  description: community.description ?? "",
  myRole: role(community.userRole),
  tournamentsPreview: [],
  membersPreview: [],
});

const fetchCommunityList = async (search = ""): Promise<CommunityRecord[]> => {
  const { data } = await api.get<ApiEnvelope<{ data: CommunityRecord[]; pagination?: { total: number; limit: number; offset: number } }>>(
    "/api/community",
    { params: { limit: 50, offset: 0, ...(search.trim() ? { search: search.trim() } : {}) } },
  );
  if (Array.isArray(data.data)) return data.data;
  return data.data?.data ?? [];
};

export const getDiscoverGroups = async (page: number, search: string) => {
  const communities = await fetchCommunityList(search);
  const limit = 20;
  const start = Math.max(0, page - 1) * limit;
  const groups = communities.slice(start, start + limit).map(asGroupOverview);
  return {
    page,
    limit,
    total: communities.length,
    totalPages: Math.max(1, Math.ceil(communities.length / limit)),
    groups,
  };
};

export const fetchGroupHub = async (groupId: string): Promise<GroupHub> => {
  const { data } = await api.get<ApiEnvelope<CommunityRecord>>(
    `/api/community/${encodeURIComponent(groupId)}?includeMembers=true`,
  );
  const community = data.data;
  const members = community.members ?? [];
  const currentRole = role(community.userRole) ?? "member";
  return {
    group: {
      id: community.id,
      chatRoomId: community.id,
      name: community.name,
      description: community.description ?? "",
      avatarUrl: community.image ?? undefined,
      privacy: "public",
      totalMembers: community.memberCount ?? members.length,
      myRole: currentRole,
    },
    stats: { activeTournaments: 0, totalTournaments: 0 },
    membersPreview: members.slice(0, 8).map((member) => ({
      id: member.id,
      displayName: member.username ?? "Member",
      ...(member.avatar ? { avatarUrl: member.avatar } : {}),
      role: role(member.role) ?? "member",
    })),
    quickActions: {
      canCreateTournament: currentRole === "owner" || currentRole === "admin",
      canManageGroup: currentRole === "owner" || currentRole === "admin",
      canInviteMembers: currentRole === "owner" || currentRole === "admin",
      canViewRequests: currentRole === "owner" || currentRole === "admin",
    },
  };
};

export const getMyGroups = async (): Promise<MyGroupItem[]> => {
  const { data } = await api.get<ApiEnvelope<MyGroupItem[]>>("/api/community/mine");
  return data.data;
};

const searchGroupsByName = async (name: string): Promise<GroupOverview[]> => {
  if (!name.trim()) return [];
  return (await fetchCommunityList(name)).map(asGroupOverview);
};

export const useSearchGroups = (search: string) => useQuery({
  queryKey: ["searchGroups", search],
  queryFn: () => searchGroupsByName(search),
  enabled: search.trim().length > 0,
  staleTime: 1000 * 30,
});

export function useGroupInfo(groupId?: string) {
  return useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      const res = await api.get<ApiEnvelope<CommunityRecord>>(
        `/api/community/${encodeURIComponent(groupId!)}`,
      );
      return res.data.data;
    },
    enabled: !!groupId,
  });
}

export const joinGroup = async (groupId: string) => {
  const { data } = await api.post(
    `/api/community/${encodeURIComponent(groupId)}/join`,
  );
  return data;
};
