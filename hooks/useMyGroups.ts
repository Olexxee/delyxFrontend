import { getMyGroups } from "@/api/apiService";
import { useQuery } from "@tanstack/react-query";

export const useMyGroups = () => {
  return useQuery({
    queryKey: ["myGroups"],
    queryFn: getMyGroups,
    staleTime: 0,
  });
};
