import { getHomeFeed } from "@/api/feedService";
import type { HomeFeedResponse, HomeFeedTab } from "@/types/feeds";
import { InfiniteData, QueryKey, useInfiniteQuery } from "@tanstack/react-query";

export const feedKeys = {
  all: ["feed"] as const,
  home: (tab: HomeFeedTab) => ["feed", "home", tab] as const,
};

export const useHomeFeed = (tab: HomeFeedTab) => {
  return useInfiniteQuery<HomeFeedResponse, Error, InfiniteData<HomeFeedResponse>, QueryKey, string | null>({
    queryKey: feedKeys.home(tab),
    queryFn: ({ pageParam }) => getHomeFeed(tab, pageParam as string | null),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};