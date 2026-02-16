import type { DiscoverGroupsResponse } from "@/types/group";
import api from "./api";

export const getDiscoverGroups = async (
  page: number,
  search: string,
): Promise<DiscoverGroupsResponse> => {
  const { data } = await api.get<DiscoverGroupsResponse>("/groups/discover", {
    params: { page, limit: 20, search },
  });

  return data;
};
