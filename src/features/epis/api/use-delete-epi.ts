import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.epis)[":epiId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.epis)[":epiId"]["$delete"]
>;

export const useDeleteEpi = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.epis[":epiId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir EPI");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("EPI excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["epis"] });
      queryClient.invalidateQueries({ queryKey: ["epi", data.$id] });
    },
    onError: () => {
      toast.error("Falha ao excluir EPI");
    },
  });

  return mutation;
};
