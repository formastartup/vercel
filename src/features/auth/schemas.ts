import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Mínimo de 8 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Obrigatório"),
  email: z.string().email(),
  password: z.string().min(8, "Mínimo de 8 caracteres"),
});
