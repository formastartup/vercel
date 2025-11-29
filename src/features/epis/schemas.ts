import { z } from "zod";

// Enums para categorias e tipos
export const EpiCategory = {
  CABECA: "Cabeça",
  OLHOS_FACE: "Olhos e Face",
  AUDITIVA: "Auditiva",
  RESPIRATORIA: "Respiratória",
  TRONCO: "Tronco",
  MEMBROS_SUPERIORES: "Membros Superiores",
  MEMBROS_INFERIORES: "Membros Inferiores",
  CORPO_INTEIRO: "Corpo Inteiro",
  QUEDA: "Proteção contra Quedas",
} as const;

export const ProtectionType = {
  IMPACTO: "Impacto",
  PERFURACAO: "Perfuração",
  CORTE: "Corte",
  ABRASAO: "Abrasão",
  QUIMICA: "Química",
  TERMICA: "Térmica",
  ELETRICA: "Elétrica",
  RADIACAO: "Radiação",
  BIOLOGICA: "Biológica",
  RUIDO: "Ruído",
  VIBRACAO: "Vibração",
  QUEDA_ALTURA: "Queda de Altura",
  UMIDADE: "Umidade",
  POEIRA: "Poeira",
  MULTIPLA: "Proteção Múltipla",
} as const;

export const UnitOfMeasure = {
  UNIDADE: "Unidade",
  PAR: "Par",
  CONJUNTO: "Conjunto",
  METRO: "Metro",
  KIT: "Kit",
} as const;

export const Application = {
  OBRA: "Obra",
  FABRICA: "Fábrica",
  AMBOS: "Ambos",
} as const;

export const createEpiSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  ca: z.string().trim().optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  protectionType: z.string().min(1, "Tipo de proteção é obrigatório"),
  lifespan: z.union([
    z.number().int().min(0, "Vida útil deve ser maior ou igual a 0"),
    z.string().transform((val) => val === "" ? undefined : parseInt(val)),
  ]).optional(),
  lifespanUnit: z.enum(["dias", "meses", "anos"]).optional(),
  unitOfMeasure: z.string().min(1, "Unidade de medida é obrigatória"),
  application: z.string().min(1, "Aplicação é obrigatória"),
  hasUvProtection: z.union([z.boolean(), z.string().transform((val) => val === "true")]).default(false),
  observations: z.string().trim().optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string(),
});

export const updateEpiSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").optional(),
  ca: z.string().trim().optional(),
  category: z.string().min(1, "Categoria é obrigatória").optional(),
  protectionType: z.string().min(1, "Tipo de proteção é obrigatório").optional(),
  lifespan: z.number().int().min(0, "Vida útil deve ser maior ou igual a 0").optional(),
  lifespanUnit: z.enum(["dias", "meses", "anos"]).optional(),
  unitOfMeasure: z.string().min(1, "Unidade de medida é obrigatória").optional(),
  application: z.string().min(1, "Aplicação é obrigatória").optional(),
  hasUvProtection: z.boolean().optional(),
  observations: z.string().trim().optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
