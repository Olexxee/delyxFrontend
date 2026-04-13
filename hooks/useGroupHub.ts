import { useQuery } from "@tanstack/react-query";
import { fetchGroupHub } from "@/api/groups.api";
import type { GroupHub } from "@/types/groupHub";

export const groupHubKeys = {
  all: ["groupHub"] as const,
  detail: (groupId: string) => [...groupHubKeys.all, groupId] as const,
};

export function useGroupHub(groupId?: string) {
  return useQuery<GroupHub>({
    queryKey: groupHubKeys.detail(groupId || ""),
    queryFn: () => fetchGroupHub(groupId!),
    enabled: Boolean(groupId),
  });
}