import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ClientesList from "./components/ClientesList";
import ClienteDialog from "./components/ClienteDialog";
import ClientesFilters from "./components/ClientesFilters";
import { ClienteFilter } from "@/lib/validations/cliente";
import { useToast } from "@/hooks/use-toast";

const ClientesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [filters, setFilters] = useState<ClienteFilter>({});
  const { toast } = useToast();

  const { data: clientes, isLoading, refetch } = useQuery({
    queryKey: ["clientes", filters],
    queryFn: async () => {
      let query = supabase.from("clientes").select("*");

      if (filters.nome) {
        query = query.ilike("nome", `%${filters.nome}%`);
      }
      if (filters.telefone) {
        query = query.ilike("telefone_ou_email", `%${filters.telefone}%`);
      }
      if (filters.genero) {
        query = query.eq("genero", filters.genero);
      }
      if (filters.cidade) {
        query = query.eq("cidade", filters.cidade);
      }
      if (filters.bairro) {
        query = query.eq("bairro", filters.bairro);
      }
      if (filters.pais) {
        query = query.eq("pais", filters.pais);
      }
      if (filters.estado) {
        query = query.eq("estado", filters.estado);
      }
      if (filters.data_nascimento) {
        query = query.eq("data_nascimento", filters.data_nascimento);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (cliente: any) => {
    setSelectedCliente(cliente);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

    const { error } = await supabase.from("clientes").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir cliente",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Cliente excluído com sucesso",
      });
      refetch();
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedCliente(null);
    refetch();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus clientes</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        <ClientesFilters onFilterChange={setFilters} />

        <ClientesList
          clientes={clientes || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ClienteDialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          cliente={selectedCliente}
        />
      </div>
    </Layout>
  );
};

export default ClientesPage;
