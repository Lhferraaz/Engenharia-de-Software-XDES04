import { z } from "zod";

export const clienteSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(40, "Nome deve ter no máximo 40 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),
  sobrenome: z
    .string()
    .min(1, "Sobrenome é obrigatório")
    .max(40, "Sobrenome deve ter no máximo 40 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Sobrenome deve conter apenas letras"),
  telefone_ou_email: z
    .string()
    .min(1, "Telefone ou E-mail é obrigatório")
    .max(40, "Deve ter no máximo 40 caracteres")
    .refine(
      (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val) || val.length > 0;
      },
      { message: "Formato de e-mail inválido" }
    ),
  genero: z.enum(["Feminino", "Masculino", "Outro"], {
    required_error: "Gênero é obrigatório",
  }),
  data_nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  senha: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(40, "Senha deve ter no máximo 40 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Senha deve conter letra maiúscula, minúscula e número"
    ),
  cidade: z
    .string()
    .max(30, "Cidade deve ter no máximo 30 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]*$/, "Cidade deve conter apenas letras")
    .optional()
    .or(z.literal("")),
  bairro: z
    .string()
    .max(30, "Bairro deve ter no máximo 30 caracteres")
    .optional()
    .or(z.literal("")),
  pais: z.string().optional().or(z.literal("")),
  estado: z.string().optional().or(z.literal("")),
  rua_avenida: z
    .string()
    .max(50, "Rua/Avenida deve ter no máximo 50 caracteres")
    .optional()
    .or(z.literal("")),
  numero: z
    .union([z.number(), z.string()])
    .transform((val) => (val === "" ? undefined : Number(val)))
    .optional(),
});

export const clienteFilterSchema = z.object({
  nome: z.string().max(80).optional(),
  telefone: z.string().max(40).optional(),
  data_nascimento: z.string().optional(),
  genero: z.enum(["Feminino", "Masculino", "Outro"]).optional(),
  cidade: z.string().optional(),
  bairro: z.string().optional(),
  pais: z.string().optional(),
  estado: z.string().optional(),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;
export type ClienteFilter = z.infer<typeof clienteFilterSchema>;
