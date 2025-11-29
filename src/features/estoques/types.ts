import { Models } from "node-appwrite";

export type Estoque = Models.Document & {
  name: string;
  type: string; // "Central" ou "Obra"
  location: string;
  responsible?: string;
  capacity?: number;
  observations?: string;
  workspaceId: string;
};

export type Movement = Models.Document & {
  estoqueId: string;
  epiId: string;
  epiName?: string; // Desnormalizado para facilitar consultas
  type: string; // "Entrada", "Saída", "Transferência", "Ajuste"
  quantity: number;
  value?: number;
  orderNumber?: string;
  deliveryNote?: string; // Canhoto de envio
  destinationEstoqueId?: string; // Para transferências
  observations?: string;
  workspaceId: string;
};

export type Order = Models.Document & {
  orderNumber: string;
  supplier: string;
  status: string;
  totalValue: number;
  expectedDate?: string;
  receivedDate?: string;
  observations?: string;
  workspaceId: string;
};

export type EstoqueWithStock = Estoque & {
  stock?: {
    epiId: string;
    epiName: string;
    quantity: number;
    lastMovement?: string;
  }[];
};
