import api from "@/api/api";
import type { HomeFeedResponse, HomeFeedTab } from "@/types/feeds";

export const getHomeFeed = async (
  tab: HomeFeedTab,
  cursor?: string | null,
): Promise<HomeFeedResponse> => {
  const { data } = await api.get("/feed/home", {
    params: {
      tab,
      cursor: cursor ?? undefined,
    },
  });

  return data;
};