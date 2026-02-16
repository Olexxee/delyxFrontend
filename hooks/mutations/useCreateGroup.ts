import { createGroup } from "@/api/apiService";
import { useMutation } from "@tanstack/react-query";

export const useCreateGroup = () => {
  return useMutation({
    mutationFn: createGroup,
  });
};
