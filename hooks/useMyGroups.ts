import { getMyGroups } from "@/api/groups.api";
import type { MyGroupItem } from "@/types/group";
import { useQuery } from "@tanstack/react-query";

export const useMyGroups = () => {
  return useQuery<MyGroupItem[]>({
    queryKey: ["myGroups"],
    queryFn: getMyGroups,
    staleTime: 0,
  });
};