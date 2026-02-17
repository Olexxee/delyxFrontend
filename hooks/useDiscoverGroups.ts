import { useInfiniteQuery } from "@tanstack/react-query";
import type { DiscoverGroupsResponse } from "@/types/group";
import { getDiscoverGroups } from "@/api/groups.api";

export const useDiscoverGroups = (search: string) => {
  return useInfiniteQuery<
    DiscoverGroupsResponse, // return type of queryFn
    Error,                 // error type
    DiscoverGroupsResponse, // data type for useInfiniteQuery
    ["discoverGroups", string], // queryKey type
    number                 // pageParam type
  >({
    queryKey: ["discoverGroups", search],
    queryFn: ({ pageParam = 1 }: { pageParam: number }) => getDiscoverGroups(pageParam, search),
    initialPageParam: 1,
    getNextPageParam: (lastPage: DiscoverGroupsResponse) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
};
