import { getDiscoverGroups } from "@/api/groups.api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useDiscoverGroups = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["discoverGroups", search],
    queryFn: ({ pageParam }) =>
      getDiscoverGroups((pageParam as number) ?? 1, search),

    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
};
