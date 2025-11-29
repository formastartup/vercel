"use client";

import { MoreVertical, Trash, Warehouse, MapPin, User, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useConfirm } from "@/hooks/use-confirm";

import { Estoque } from "../types";
import { useDeleteEstoque } from "../api/use-delete-estoque";

interface EstoqueCardProps {
  estoque: Estoque;
}

export const EstoqueCard = ({ estoque }: EstoqueCardProps) => {
  const { mutate: deleteEstoque, isPending } = useDeleteEstoque();
  const [ConfirmDialog, confirm] = useConfirm(
    "Deletar Estoque",
    "Esta ação não pode ser desfeita. Todas as movimentações relacionadas serão mantidas.",
    "destructive"
  );

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteEstoque({
      param: { estoqueId: estoque.$id },
    });
  };

  const getTypeColor = () => {
    return estoque.type === "Central" ? "default" : "secondary";
  };

  return (
    <>
      <ConfirmDialog />
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="p-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="p-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-lg bg-blue-500 flex items-center justify-center">
                <Warehouse className="size-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">
                  {estoque.name}
                </CardTitle>
                <Badge variant={getTypeColor()} className="mt-1">
                  {estoque.type}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={isPending}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isPending}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Deletar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="flex-1">{estoque.location}</span>
            </div>

            {estoque.responsible && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 flex-shrink-0" />
                <span>{estoque.responsible}</span>
              </div>
            )}

            {estoque.capacity && (
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 flex-shrink-0" />
                <span>Capacidade: {estoque.capacity} unidades</span>
              </div>
            )}
          </div>

          {estoque.observations && (
            <p className="text-xs text-muted-foreground mt-4 pt-4 border-t line-clamp-2 italic">
              {estoque.observations}
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
};
