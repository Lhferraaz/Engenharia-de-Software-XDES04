import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientesListProps {
  clientes: any[];
  isLoading: boolean;
  onEdit: (cliente: any) => void;
  onDelete: (id: string) => void;
}

const ClientesList = ({ clientes, isLoading, onEdit, onDelete }: ClientesListProps) => {
  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando...</div>;
  }

  if (!clientes.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum cliente encontrado
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Gênero</TableHead>
            <TableHead>Data Nascimento</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell className="font-medium">
                {cliente.nome} {cliente.sobrenome}
              </TableCell>
              <TableCell>{cliente.telefone_ou_email}</TableCell>
              <TableCell>{cliente.genero}</TableCell>
              <TableCell>
                {format(new Date(cliente.data_nascimento), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell>{cliente.cidade || "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(cliente)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(cliente.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientesList;
