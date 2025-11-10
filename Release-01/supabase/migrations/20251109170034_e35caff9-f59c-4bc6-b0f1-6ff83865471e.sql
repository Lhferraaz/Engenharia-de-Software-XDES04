-- Tabela de Marcas (para o campo Marca em Produtos)
CREATE TABLE public.marcas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir algumas marcas iniciais
INSERT INTO public.marcas (nome) VALUES 
  ('Nike'),
  ('Adidas'),
  ('Zara'),
  ('H&M'),
  ('Gucci'),
  ('Prada'),
  ('Calvin Klein'),
  ('Tommy Hilfiger');

-- Tabela de Clientes
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  sobrenome TEXT NOT NULL,
  telefone_ou_email TEXT NOT NULL,
  genero TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  senha TEXT NOT NULL,
  cidade TEXT,
  bairro TEXT,
  pais TEXT,
  estado TEXT,
  rua_avenida TEXT,
  numero INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT genero_check CHECK (genero IN ('Feminino', 'Masculino', 'Outro'))
);

-- Tabela de Produtos
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_produto TEXT NOT NULL,
  tipo TEXT NOT NULL,
  caracteristicas TEXT[] NOT NULL,
  marca_id UUID NOT NULL REFERENCES public.marcas(id),
  tamanho TEXT NOT NULL,
  cor TEXT[] NOT NULL,
  preco NUMERIC(9,2) NOT NULL,
  quantidade_estoque INTEGER NOT NULL DEFAULT 0,
  imagem_url TEXT NOT NULL,
  tecido TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para Marcas (apenas leitura pública)
CREATE POLICY "Marcas são visíveis para todos"
ON public.marcas FOR SELECT
USING (true);

-- Políticas RLS para Clientes (acesso completo sem autenticação para admin)
CREATE POLICY "Clientes são visíveis para todos"
ON public.clientes FOR SELECT
USING (true);

CREATE POLICY "Qualquer um pode inserir clientes"
ON public.clientes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Qualquer um pode atualizar clientes"
ON public.clientes FOR UPDATE
USING (true);

CREATE POLICY "Qualquer um pode deletar clientes"
ON public.clientes FOR DELETE
USING (true);

-- Políticas RLS para Produtos (acesso completo sem autenticação para admin)
CREATE POLICY "Produtos são visíveis para todos"
ON public.produtos FOR SELECT
USING (true);

CREATE POLICY "Qualquer um pode inserir produtos"
ON public.produtos FOR INSERT
WITH CHECK (true);

CREATE POLICY "Qualquer um pode atualizar produtos"
ON public.produtos FOR UPDATE
USING (true);

CREATE POLICY "Qualquer um pode deletar produtos"
ON public.produtos FOR DELETE
USING (true);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_produtos_updated_at
  BEFORE UPDATE ON public.produtos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhorar performance nas consultas
CREATE INDEX idx_clientes_nome ON public.clientes(nome);
CREATE INDEX idx_clientes_telefone_ou_email ON public.clientes(telefone_ou_email);
CREATE INDEX idx_clientes_data_nascimento ON public.clientes(data_nascimento);
CREATE INDEX idx_clientes_genero ON public.clientes(genero);
CREATE INDEX idx_clientes_cidade ON public.clientes(cidade);
CREATE INDEX idx_clientes_bairro ON public.clientes(bairro);

CREATE INDEX idx_produtos_nome ON public.produtos(nome_produto);
CREATE INDEX idx_produtos_tipo ON public.produtos(tipo);
CREATE INDEX idx_produtos_marca ON public.produtos(marca_id);
CREATE INDEX idx_produtos_preco ON public.produtos(preco);
CREATE INDEX idx_produtos_caracteristicas ON public.produtos USING GIN(caracteristicas);
CREATE INDEX idx_produtos_cor ON public.produtos USING GIN(cor);