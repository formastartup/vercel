"use client";

import { z } from "zod";
import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DottedSeparator } from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

import {
  createEpiSchema,
  EpiCategory,
  ProtectionType,
  UnitOfMeasure,
  Application,
} from "../schemas";
import { useCreateEpi } from "../api/use-create-epi";

interface CreateEpiFormProps {
  onCancel?: () => void;
}

export const CreateEpiForm = ({ onCancel }: CreateEpiFormProps) => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateEpi();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createEpiSchema>>({
    resolver: zodResolver(createEpiSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
      ca: "",
      category: "",
      protectionType: "",
      lifespan: undefined,
      lifespanUnit: "meses",
      unitOfMeasure: "",
      application: "",
      hasUvProtection: false,
      observations: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createEpiSchema>) => {
    const finalValues = {
      name: values.name,
      ca: values.ca || "",
      category: values.category,
      protectionType: values.protectionType,
      lifespan: values.lifespan !== undefined ? String(values.lifespan) : "",
      lifespanUnit: values.lifespanUnit || "meses",
      unitOfMeasure: values.unitOfMeasure,
      application: values.application,
      hasUvProtection: String(values.hasUvProtection),
      observations: values.observations || "",
      image: values.image instanceof File ? values.image : "",
      workspaceId,
    };

    mutate(
      { form: finalValues },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Cadastrar EPI</CardTitle>
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
                    <FormLabel>Nome do EPI *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: Capacete de Segurança"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CA - Certificado de Aprovação</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: 12345"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Número do certificado do Ministério do Trabalho
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(EpiCategory).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unitOfMeasure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade de Medida *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(UnitOfMeasure).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DottedSeparator />

            {/* Proteção e Aplicação */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Proteção e Aplicação
              </h3>
              <FormField
                control={form.control}
                name="protectionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Proteção *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(ProtectionType).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="application"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aplicação *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(Application).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Onde o EPI será utilizado</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasUvProtection"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value === true}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Proteção UV</FormLabel>
                      <FormDescription>
                        Este EPI possui proteção contra raios ultravioleta
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DottedSeparator />

            {/* Vida Útil */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Vida Útil
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="lifespan"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Duração</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          placeholder="0"
                          disabled={isPending}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? undefined : Number(e.target.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lifespanUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dias">Dias</SelectItem>
                          <SelectItem value="meses">Meses</SelectItem>
                          <SelectItem value="anos">Anos</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                        placeholder="Informações adicionais sobre o EPI, restrições de uso, etc."
                        rows={4}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DottedSeparator />

            {/* Imagem */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <div className="flex flex-col gap-y-2">
                  <div className="flex items-center gap-x-5">
                    {field.value ? (
                      <div className="size-[72px] relative rounded-md overflow-hidden">
                        <Image
                          src={
                            field.value instanceof File
                              ? URL.createObjectURL(field.value)
                              : field.value
                          }
                          alt="EPI"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <Avatar className="size-[72px]">
                        <AvatarFallback>
                          <ImageIcon className="size-[36px] text-neutral-400" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <p className="text-sm">Imagem do EPI</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG, SVG, JPEG, WEBP, máximo 1mb
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        accept=".jpg, .png, .svg, .jpeg, .webp"
                        ref={inputRef}
                        onChange={handleImageChange}
                        disabled={isPending}
                      />
                      {field.value ? (
                        <Button
                          type="button"
                          disabled={isPending}
                          size="xs"
                          variant="destructive"
                          className="w-fit mt-2"
                          onClick={() => {
                            field.onChange(null);
                            if (inputRef.current) {
                              inputRef.current.value = "";
                            }
                          }}
                        >
                          Remover Imagem
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          disabled={isPending}
                          size="xs"
                          variant="teritary"
                          className="w-fit mt-2"
                          onClick={() => inputRef.current?.click()}
                        >
                          Upload Imagem
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            />

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
                Cadastrar EPI
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
