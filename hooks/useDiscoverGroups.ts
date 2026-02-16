import { getDiscoverGroups } from "@/api/groups.api";
import type { DiscoverGroupsResponse } from "@/types/group";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useDiscoverGroups = (search: string) => {
  return useInfiniteQuery<DiscoverGroupsResponse>({
    queryKey: ["discoverGroups", search],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getDiscoverGroups(pageParam as number, search),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
};
