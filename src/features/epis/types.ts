import { Models } from "node-appwrite";

export type Epi = Models.Document & {
  name: string;
  ca?: string; // Certificado de Aprovação
  category: string;
  protectionType: string;
  lifespan?: number;
  lifespanUnit?: "dias" | "meses" | "anos";
  unitOfMeasure: string;
  application: string;
  hasUvProtection: boolean;
  observations?: string;
  imageUrl?: string;
  workspaceId: string;
};
