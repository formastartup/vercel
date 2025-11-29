"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DottedSeparator } from "@/components/dotted-separator";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { createEstoqueSchema, StockType } from "../schemas";
import { useCreateEstoque } from "../api/use-create-estoque";

interface CreateEstoqueFormProps {
  onCancel?: () => void;
}

export const CreateEstoqueForm = ({ onCancel }: CreateEstoqueFormProps) => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateEstoque();

  const form = useForm<z.infer<typeof createEstoqueSchema>>({
    resolver: zodResolver(createEstoqueSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
      type: "",
      location: "",
      responsible: "",
      capacity: undefined,
      observations: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createEstoqueSchema>) => {
    const finalValues = {
      ...values,
      workspaceId,
    };

    mutate(
      { json: finalValues },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Cadastrar Estoque</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Informações Básicas
              </h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Estoque *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: Estoque Central SP"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(StockType).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Central ou Obra específica
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DottedSeparator />

            {/* Localização */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Localização e Responsável
              </h3>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: Rua ABC, 123 - São Paulo/SP"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Endereço completo do estoque
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nome do responsável"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DottedSeparator />

            {/* Capacidade */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Capacidade
              </h3>

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidade (unidades)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="0"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseInt(value) : undefined);
                        }}
                        value={field.value ?? ""}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Capacidade máxima de armazenamento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DottedSeparator />

            {/* Observações */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Informações adicionais sobre o estoque..."
                        rows={4}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DottedSeparator className="py-7" />

            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancelar
              </Button>

              <Button type="submit" size="lg" disabled={isPending}>
                Cadastrar Estoque
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
