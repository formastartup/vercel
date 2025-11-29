"use client";

import { Plus, Warehouse } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Card, CardContent } from "@/components/ui/card";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";

import { useGetEstoques } from "@/features/estoques/api/use-get-estoques";
import { useCreateEstoqueModal } from "@/features/estoques/hooks/use-create-estoque-modal";
import { EstoqueCard } from "@/features/estoques/components/estoque-card";

export default function EstoquesPage() {
  const workspaceId = useWorkspaceId();
  const { data: estoques, isLoading } = useGetEstoques({ workspaceId });
  const { open } = useCreateEstoqueModal();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!estoques) {
    return <PageError message="Falha ao carregar estoques" />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col gap-y-4 px-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Warehouse className="size-6 text-blue-600" />
              Gestão de Estoques
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Controle de estoque central e estoques de obras
            </p>
          </div>
          <Button onClick={open} size="sm">
            <Plus className="size-4 mr-2" />
            Novo Estoque
          </Button>
        </div>
        <DottedSeparator />
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        {estoques.documents.length === 0 ? (
          <Card className="h-full flex flex-col items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="size-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Warehouse className="size-10 text-blue-500" />
              </div>
              <p className="text-lg font-semibold mb-2">
                Nenhum estoque cadastrado
              </p>
              <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
                Cadastre estoques centrais e de obras para controlar entradas,
                saídas e movimentações de EPIs
              </p>
              <Button onClick={open}>
                <Plus className="size-4 mr-2" />
                Cadastrar Primeiro Estoque
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {estoques.documents.map((estoque) => (
              <EstoqueCard key={estoque.$id} estoque={estoque} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
