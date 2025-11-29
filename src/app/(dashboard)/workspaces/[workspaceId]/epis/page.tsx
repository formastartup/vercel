"use client";

import { Plus, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Card, CardContent } from "@/components/ui/card";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";

import { useGetEpis } from "@/features/epis/api/use-get-epis";
import { useCreateEpiModal } from "@/features/epis/hooks/use-create-epi-modal";
import { EpiCard } from "@/features/epis/components/epi-card";

export default function EpisPage() {
  const workspaceId = useWorkspaceId();
  const { data: epis, isLoading } = useGetEpis({ workspaceId });
  const { open } = useCreateEpiModal();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!epis) {
    return <PageError message="Falha ao carregar EPIs" />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col gap-y-4 px-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Shield className="size-6 text-blue-600" />
              Equipamentos de Proteção Individual
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie o cadastro de EPIs do seu Workspace
            </p>
          </div>
          <Button onClick={open} size="sm">
            <Plus className="size-4 mr-2" />
            Novo EPI
          </Button>
        </div>
        <DottedSeparator />
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        {epis.documents.length === 0 ? (
          <Card className="h-full flex flex-col items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="size-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Shield className="size-10 text-blue-500" />
              </div>
              <p className="text-lg font-semibold mb-2">
                Nenhum EPI cadastrado
              </p>
              <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
                Comece cadastrando seu primeiro Equipamento de Proteção
                Individual com todas as informações necessárias
              </p>
              <Button onClick={open}>
                <Plus className="size-4 mr-2" />
                Cadastrar Primeiro EPI
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {epis.documents.map((epi) => (
              <EpiCard key={epi.$id} epi={epi} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
