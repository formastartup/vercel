import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.estoques)[":estoqueId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.estoques)[":estoqueId"]["$delete"]
>;

export const useDeleteEstoque = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.estoques[":estoqueId"]["$delete"]({
        param,
      });
      if (!response.ok) throw new Error("Failed to delete estoque");
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Estoque deletado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["estoques"] });
      queryClient.invalidateQueries({ queryKey: ["estoque", data.$id] });
    },
    onError: () => {
      toast.error("Falha ao deletar estoque");
    },
  });

  return mutation;
};
