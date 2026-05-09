import type {
  GroupOverview,
  MyGroupItem,
  MyGroupsResponse,
} from "@/types/group";
import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { GroupHub } from "@/types/groupHub";

/**
 * Fetches discoverable groups from the backend
 */
export const getDiscoverGroups = async (page: number, search: string) => {
  const { data } = await api.get("/groups/discover", {
    params: { page, limit: 20, search },
  });

  return {
    page: data.page,
    limit: data.limit,
    total: data.total,
    totalPages: Math.ceil(data.total / data.limit),
    groups: data.data.map(
      (g: any): GroupOverview => ({
        id: g._id,
        name: g.name,
        avatar:
          typeof g.avatar === "string" ? g.avatar : (g.avatar?.url ?? null),
        privacy: g.privacy ?? "public",
        totalMembers: g.totalMembers ?? 0,
        description: g.description ?? "",
        myRole: g.myRole ?? "member",
        tournamentsPreview: g.tournamentsPreview ?? [],
        membersPreview: g.membersPreview ?? [],
      }),
    ),
  };
};

export const fetchGroupHub = async (groupId: string): Promise<GroupHub> => {
  const { data } = await api.get(`/groups/${groupId}/hub`);
  return data.data;
};

export const getMyGroups = async (): Promise<MyGroupItem[]> => {
  const { data } = await api.get<MyGroupsResponse>("/groups/my-groups");
  return data.data;
};

const searchGroupsByName = async (name: string): Promise<GroupOverview[]> => {
  if (!name.trim()) return [];

  const { data } = await api.get(
    `/groups/name/${encodeURIComponent(name.trim())}`,
  );

  const groupList = data.groups || [];

  return groupList.map(
    (g: any): GroupOverview => ({
      id: g.id || g._id,
      name: g.name,
      avatar: typeof g.avatar === "string" ? g.avatar : (g.avatar?.url ?? null),
      privacy: g.privacy ?? "public",
      totalMembers: g.totalMembers ?? 0,
      chatRoomId: g.chatRoomId ?? null,
      description: g.description || g.bio || "",
      myRole: g.myRole ?? null,
      tournamentsPreview: g.tournamentsPreview ?? [],
      membersPreview: g.membersPreview ?? [],
    }),
  );
};

export const useSearchGroups = (search: string) => {
  return useQuery({
    queryKey: ["searchGroups", search],
    queryFn: () => searchGroupsByName(search),
    enabled: search.trim().length > 0,
    staleTime: 1000 * 30,
  });
};

export function useGroupInfo(groupId?: string) {
  return useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      const res = await api.get(`/groups/${groupId}/overview`);
      return res.data.data;
    },
    enabled: !!groupId,
  });
}

export const joinGroup = async (groupId: string) => {
  const { data } = await api.post(`/groups/${groupId}/join-request`);
  return data;
};
