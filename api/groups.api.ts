import type { DiscoverGroupsResponse, Group } from "@/types/group";
import { useQuery } from "@tanstack/react-query";
import api from "./api";

/**
 * Fetches discoverable groups from the backend
 */
export const getDiscoverGroups = async (
  page: number,
  search: string,
): Promise<DiscoverGroupsResponse> => {
  const { data } = await api.get("/groups/discover", {
    params: { page, limit: 20, search },
  });

  return {
    page: data.page,
    limit: data.limit,
    total: data.total,
    totalPages: Math.ceil(data.total / data.limit),
    groups: data.data.map(
      (g: any): Group => ({
        id: g._id,
        name: g.name,
        avatar:
          typeof g.avatar === "string" ? g.avatar : (g.avatar?.url ?? null),
        privacy: "public", // update if backend returns privacy
        memberCount: g.totalMembers ?? 0,
      }),
    ),
  };
};


const searchGroupsByName = async (name: string): Promise<Group[]> => {
  const { data } = await api.get(
    `/groups/name/${encodeURIComponent(name.trim())}`,
  );
  return (data.groups ?? []).map(
    (g: any): Group => ({
      id: g.id,
      name: g.name,
      avatar: typeof g.avatar === "string" ? g.avatar : (g.avatar?.url ?? null),
      privacy: g.privacy ?? "public",
      memberCount: g.totalMembers ?? 0,
      chatRoomId: g.chatRoomId,
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
