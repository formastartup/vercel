import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.estoques)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.estoques)["$post"]>;

export const useCreateEstoque = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.estoques["$post"]({ json });
      if (!response.ok) throw new Error("Failed to create estoque");
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Estoque cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["estoques"] });
    },
    onError: () => {
      toast.error("Falha ao cadastrar estoque");
    },
  });

  return mutation;
};
