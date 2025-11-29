import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetEpisProps {
  workspaceId: string;
}

export const useGetEpis = ({ workspaceId }: UseGetEpisProps) => {
  const query = useQuery({
    queryKey: ["epis", workspaceId],
    queryFn: async () => {
      const response = await client.api.epis.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar EPIs");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
