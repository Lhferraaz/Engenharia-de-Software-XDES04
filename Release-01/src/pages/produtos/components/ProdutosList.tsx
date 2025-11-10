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
import { Badge } from "@/components/ui/badge";

interface ProdutosListProps {
  produtos: any[];
  isLoading: boolean;
  onEdit: (produto: any) => void;
  onDelete: (id: string) => void;
}

const ProdutosList = ({ produtos, isLoading, onEdit, onDelete }: ProdutosListProps) => {
  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando...</div>;
  }

  if (!produtos.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum produto encontrado
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Tamanho</TableHead>
            <TableHead>Cores</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produtos.map((produto) => (
            <TableRow key={produto.id}>
              <TableCell className="font-medium">{produto.nome_produto}</TableCell>
              <TableCell>{produto.tipo}</TableCell>
              <TableCell>{produto.marca?.nome}</TableCell>
              <TableCell>{produto.tamanho}</TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {produto.cor.slice(0, 3).map((cor: string) => (
                    <Badge key={cor} variant="secondary" className="text-xs">
                      {cor}
                    </Badge>
                  ))}
                  {produto.cor.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{produto.cor.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>R$ {Number(produto.preco).toFixed(2)}</TableCell>
              <TableCell>{produto.quantidade_estoque}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(produto)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(produto.id)}
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

export default ProdutosList;
