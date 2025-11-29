import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout["$post"]();

      if (!response.ok) {
        throw new Error("Falha ao sair");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Saiu");
      
      router.refresh();
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error("Falha ao sair");
    },
  });
  return mutation;
};
