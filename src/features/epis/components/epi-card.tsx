"use client";

import Image from "next/image";
import { MoreVertical, Trash, Shield, Clock, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useConfirm } from "@/hooks/use-confirm";

import { Epi } from "../types";
import { useDeleteEpi } from "../api/use-delete-epi";

interface EpiCardProps {
  epi: Epi;
}

export const EpiCard = ({ epi }: EpiCardProps) => {
  const { mutate: deleteEpi, isPending } = useDeleteEpi();
  const [ConfirmDialog, confirm] = useConfirm(
    "Deletar EPI",
    "Esta ação não pode ser desfeita.",
    "destructive"
  );

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteEpi({
      param: { epiId: epi.$id },
    });
  };

  const getLifespanText = () => {
    if (!epi.lifespan) return null;
    return `${epi.lifespan} ${epi.lifespanUnit}`;
  };

  return (
    <>
      <ConfirmDialog />
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="p-0">
          {epi.imageUrl ? (
            <div className="relative w-full h-48">
              <Image
                src={epi.imageUrl}
                alt={epi.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <Avatar className="size-20">
                <AvatarFallback className="text-2xl font-bold bg-blue-500 text-white">
                  <Shield className="size-10" />
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {epi.name}
              </CardTitle>
              {epi.ca && (
                <CardDescription className="text-xs text-muted-foreground mt-1">
                  CA: {epi.ca}
                </CardDescription>
              )}
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

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              {epi.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {epi.application}
            </Badge>
            {epi.hasUvProtection && (
              <Badge variant="default" className="text-xs bg-yellow-500">
                UV
              </Badge>
            )}
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="truncate">{epi.protectionType}</span>
            </div>

            {getLifespanText() && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Vida útil: {getLifespanText()}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>{epi.unitOfMeasure}</span>
            </div>
          </div>

          {epi.observations && (
            <p className="text-xs text-muted-foreground mt-3 line-clamp-2 italic">
              {epi.observations}
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
};
