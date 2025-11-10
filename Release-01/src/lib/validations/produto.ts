import { z } from "zod";

export const produtoSchema = z.object({
  nome_produto: z.string().min(1, "Nome do produto é obrigatório"),
  tipo: z
    .string()
    .min(1, "Tipo é obrigatório")
    .max(40, "Tipo deve ter no máximo 40 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Tipo deve conter apenas letras"),
  caracteristicas: z
    .array(z.string())
    .min(1, "Adicione pelo menos uma característica")
    .refine(
      (chars) => chars.join(", ").length <= 150,
      "Características devem ter no máximo 150 caracteres no total"
    ),
  marca_id: z.string().min(1, "Marca é obrigatória"),
  tamanho: z.string().min(1, "Tamanho é obrigatório"),
  cor: z.array(z.string()).min(1, "Selecione pelo menos uma cor"),
  preco: z
    .union([z.number(), z.string()])
    .transform((val) => {
      const num = typeof val === "string" ? parseFloat(val) : val;
      return isNaN(num) ? 0 : num;
    })
    .refine((val) => val > 0, "Preço deve ser maior que zero")
    .refine((val) => val < 10000000, "Preço deve ter no máximo 7 dígitos"),
  quantidade_estoque: z
    .union([z.number(), z.string()])
    .transform((val) => (val === "" ? 0 : Number(val)))
    .refine((val) => val >= 0, "Quantidade deve ser maior ou igual a zero"),
  imagem_url: z.string().min(1, "Imagem é obrigatória"),
  tecido: z
    .string()
    .min(1, "Tecido é obrigatório")
    .max(40, "Tecido deve ter no máximo 40 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Tecido deve conter apenas letras"),
});

export const produtoFilterSchema = z.object({
  nome_produto: z.string().optional(),
  tipo: z.string().optional(),
  caracteristicas: z.array(z.string()).optional(),
  marca_id: z.string().optional(),
  tamanho: z.string().optional(),
  cor: z.array(z.string()).optional(),
  preco_min: z.number().optional(),
  preco_max: z.number().optional(),
  tecido: z.string().optional(),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;
export type ProdutoFilter = z.infer<typeof produtoFilterSchema>;

export const coresDisponiveis = [
  "Vermelho",
  "Azul",
  "Preto",
  "Branco",
  "Verde",
  "Amarelo",
  "Rosa",
  "Laranja",
  "Roxo",
  "Marrom",
  "Cinza",
];
