import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.epis)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.epis)["$post"]>;

export const useCreateEpi = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.epis["$post"]({ form });

      if (!response.ok) {
        throw new Error("Falha ao criar EPI");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("EPI cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["epis"] });
    },
    onError: () => {
      toast.error("Falha ao cadastrar EPI");
    },
  });

  return mutation;
};
