import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  ProdutoFormData,
  produtoSchema,
  coresDisponiveis,
} from "@/lib/validations/produto";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProdutoDialogProps {
  open: boolean;
  onClose: () => void;
  produto?: any;
}

const ProdutoDialog = ({ open, onClose, produto }: ProdutoDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [caracteristicaInput, setCaracteristicaInput] = useState("");
  const [caracteristicas, setCaracteristicas] = useState<string[]>([]);

  const { data: marcas } = useQuery({
    queryKey: ["marcas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marcas")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      cor: [],
    },
  });

  const selectedCores = watch("cor") || [];

  useEffect(() => {
    if (produto) {
      reset({
        ...produto,
        preco: Number(produto.preco),
      });
      setCaracteristicas(produto.caracteristicas || []);
    } else {
      reset({
        nome_produto: "",
        tipo: "",
        caracteristicas: [],
        marca_id: "",
        tamanho: "",
        cor: [],
        preco: 0,
        quantidade_estoque: 0,
        imagem_url: "",
        tecido: "",
      });
      setCaracteristicas([]);
    }
  }, [produto, reset]);

  const addCaracteristica = () => {
    if (caracteristicaInput.trim()) {
      const newCaracteristicas = [...caracteristicas, caracteristicaInput.trim()];
      setCaracteristicas(newCaracteristicas);
      setValue("caracteristicas", newCaracteristicas);
      setCaracteristicaInput("");
    }
  };

  const removeCaracteristica = (index: number) => {
    const newCaracteristicas = caracteristicas.filter((_, i) => i !== index);
    setCaracteristicas(newCaracteristicas);
    setValue("caracteristicas", newCaracteristicas);
  };

  const toggleCor = (cor: string) => {
    const current = selectedCores;
    const newCores = current.includes(cor)
      ? current.filter((c) => c !== cor)
      : [...current, cor];
    setValue("cor", newCores);
  };

  const onSubmit = async (data: ProdutoFormData) => {
    setIsLoading(true);

    try {
      const submitData = {
        nome_produto: data.nome_produto,
        tipo: data.tipo,
        marca_id: data.marca_id,
        tamanho: data.tamanho,
        cor: data.cor,
        preco: data.preco,
        quantidade_estoque: data.quantidade_estoque,
        imagem_url: data.imagem_url,
        tecido: data.tecido,
        caracteristicas: caracteristicas,
      };

      if (produto) {
        const { error } = await supabase
          .from("produtos")
          .update(submitData)
          .eq("id", produto.id);

        if (error) throw error;

        toast({
          title: "Produto atualizado com sucesso",
        });
      } else {
        const { error } = await supabase.from("produtos").insert([submitData]);

        if (error) throw error;

        toast({
          title: "Produto criado com sucesso",
        });
      }

      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar produto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {produto ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome_produto">Nome do Produto *</Label>
              <Input id="nome_produto" {...register("nome_produto")} />
              {errors.nome_produto && (
                <p className="text-sm text-destructive">
                  {errors.nome_produto.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Input id="tipo" {...register("tipo")} />
              {errors.tipo && (
                <p className="text-sm text-destructive">{errors.tipo.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Características do Produto *</Label>
            <div className="flex gap-2">
              <Input
                value={caracteristicaInput}
                onChange={(e) => setCaracteristicaInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCaracteristica())}
                placeholder="Digite e pressione Enter"
              />
              <Button type="button" onClick={addCaracteristica}>
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {caracteristicas.map((carac, index) => (
                <Badge key={index} variant="secondary">
                  {carac}
                  <button
                    type="button"
                    onClick={() => removeCaracteristica(index)}
                    className="ml-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {errors.caracteristicas && (
              <p className="text-sm text-destructive">
                {errors.caracteristicas.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marca_id">Marca *</Label>
              <Controller
                name="marca_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {marcas?.map((marca) => (
                        <SelectItem key={marca.id} value={marca.id}>
                          {marca.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.marca_id && (
                <p className="text-sm text-destructive">{errors.marca_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tamanho">Tamanho *</Label>
              <Input id="tamanho" {...register("tamanho")} />
              {errors.tamanho && (
                <p className="text-sm text-destructive">{errors.tamanho.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cores * (Selecione uma ou mais)</Label>
            <div className="grid grid-cols-3 gap-2">
              {coresDisponiveis.map((cor) => (
                <div key={cor} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cor-${cor}`}
                    checked={selectedCores.includes(cor)}
                    onCheckedChange={() => toggleCor(cor)}
                  />
                  <label
                    htmlFor={`cor-${cor}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {cor}
                  </label>
                </div>
              ))}
            </div>
            {errors.cor && (
              <p className="text-sm text-destructive">{errors.cor.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$) *</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                {...register("preco")}
              />
              {errors.preco && (
                <p className="text-sm text-destructive">{errors.preco.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade_estoque">Quantidade em Estoque *</Label>
              <Input
                id="quantidade_estoque"
                type="number"
                {...register("quantidade_estoque")}
              />
              {errors.quantidade_estoque && (
                <p className="text-sm text-destructive">
                  {errors.quantidade_estoque.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tecido">Tecido *</Label>
              <Input id="tecido" {...register("tecido")} />
              {errors.tecido && (
                <p className="text-sm text-destructive">{errors.tecido.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagem_url">URL da Imagem *</Label>
            <Input id="imagem_url" {...register("imagem_url")} />
            {errors.imagem_url && (
              <p className="text-sm text-destructive">{errors.imagem_url.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProdutoDialog;
