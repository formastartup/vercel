import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetEstoquesProps {
  workspaceId: string;
}

export const useGetEstoques = ({ workspaceId }: UseGetEstoquesProps) => {
  const query = useQuery({
    queryKey: ["estoques", workspaceId],
    queryFn: async () => {
      const response = await client.api.estoques.$get({
        query: { workspaceId },
      });
      if (!response.ok) throw new Error("Failed to fetch estoques");
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
