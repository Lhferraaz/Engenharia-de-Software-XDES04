import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProdutosList from "./components/ProdutosList";
import ProdutoDialog from "./components/ProdutoDialog";
import ProdutosFilters from "./components/ProdutosFilters";
import { ProdutoFilter } from "@/lib/validations/produto";
import { useToast } from "@/hooks/use-toast";

const ProdutosPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<any>(null);
  const [filters, setFilters] = useState<ProdutoFilter>({});
  const { toast } = useToast();

  const { data: produtos, isLoading, refetch } = useQuery({
    queryKey: ["produtos", filters],
    queryFn: async () => {
      let query = supabase
        .from("produtos")
        .select("*, marca:marcas(nome)");

      if (filters.nome_produto) {
        query = query.ilike("nome_produto", `%${filters.nome_produto}%`);
      }
      if (filters.tipo) {
        query = query.eq("tipo", filters.tipo);
      }
      if (filters.marca_id) {
        query = query.eq("marca_id", filters.marca_id);
      }
      if (filters.tamanho) {
        query = query.eq("tamanho", filters.tamanho);
      }
      if (filters.tecido) {
        query = query.eq("tecido", filters.tecido);
      }
      if (filters.preco_min) {
        query = query.gte("preco", filters.preco_min);
      }
      if (filters.preco_max) {
        query = query.lte("preco", filters.preco_max);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (produto: any) => {
    setSelectedProduto(produto);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    const { error } = await supabase.from("produtos").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir produto",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Produto excluído com sucesso",
      });
      refetch();
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedProduto(null);
    refetch();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus produtos</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </div>

        <ProdutosFilters onFilterChange={setFilters} />

        <ProdutosList
          produtos={produtos || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ProdutoDialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          produto={selectedProduto}
        />
      </div>
    </Layout>
  );
};

export default ProdutosPage;
