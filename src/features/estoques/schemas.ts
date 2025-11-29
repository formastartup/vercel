import { z } from "zod";

// Tipos de Estoque
export const StockType = {
  CENTRAL: "Central",
  OBRA: "Obra",
} as const;

// Tipos de Movimentação
export const MovementType = {
  ENTRADA: "Entrada",
  SAIDA: "Saída",
  TRANSFERENCIA: "Transferência",
  AJUSTE: "Ajuste",
} as const;

// Status de Pedido
export const OrderStatus = {
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  EM_TRANSITO: "Em Trânsito",
  RECEBIDO: "Recebido",
  CANCELADO: "Cancelado",
} as const;

export const createEstoqueSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  location: z.string().trim().min(1, "Localização é obrigatória"),
  responsible: z.string().trim().optional(),
  capacity: z.union([
    z.number().int().min(0),
    z.string().transform((val) => val === "" ? undefined : parseInt(val)),
  ]).optional(),
  observations: z.string().trim().optional(),
  workspaceId: z.string(),
});

export const createMovementSchema = z.object({
  estoqueId: z.string().min(1, "Estoque é obrigatório"),
  epiId: z.string().min(1, "EPI é obrigatório"),
  type: z.string().min(1, "Tipo de movimentação é obrigatório"),
  quantity: z.union([
    z.number().int().min(1, "Quantidade deve ser maior que 0"),
    z.string().transform((val) => parseInt(val)),
  ]),
  value: z.union([
    z.number().min(0),
    z.string().transform((val) => val === "" ? 0 : parseFloat(val)),
  ]).optional(),
  orderNumber: z.string().trim().optional(),
  deliveryNote: z.string().trim().optional(), // Canhoto de envio
  destinationEstoqueId: z.string().optional(), // Para transferências
  observations: z.string().trim().optional(),
  workspaceId: z.string(),
});

export const createOrderSchema = z.object({
  orderNumber: z.string().trim().min(1, "Número do pedido é obrigatório"),
  supplier: z.string().trim().min(1, "Fornecedor é obrigatório"),
  status: z.string().min(1, "Status é obrigatório"),
  totalValue: z.union([
    z.number().min(0),
    z.string().transform((val) => parseFloat(val)),
  ]),
  expectedDate: z.string().optional(),
  receivedDate: z.string().optional(),
  observations: z.string().trim().optional(),
  workspaceId: z.string(),
});

export const updateEstoqueSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").optional(),
  type: z.string().min(1, "Tipo é obrigatório").optional(),
  location: z.string().trim().min(1, "Localização é obrigatória").optional(),
  responsible: z.string().trim().optional(),
  capacity: z.union([
    z.number().int().min(0),
    z.string().transform((val) => val === "" ? undefined : parseInt(val)),
  ]).optional(),
  observations: z.string().trim().optional(),
});
