import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCommunity,
  joinCommunity,
  leaveCommunity,
  listCommunities,
} from "@/src/features/communities/api";

export const communityKeys = {
  all: ["communities"] as const,
  list: (search: string) => ["communities", "list", search] as const,
};

export function useCommunities(search: string) {
  return useQuery({
    queryKey: communityKeys.list(search),
    queryFn: () => listCommunities(search),
    staleTime: 30_000,
  });
}

export function useCreateCommunity() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createCommunity,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: communityKeys.all });
    },
  });
}

export function useJoinCommunity() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: joinCommunity,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: communityKeys.all });
    },
  });
}

export function useLeaveCommunity() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: leaveCommunity,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: communityKeys.all });
    },
  });
}
