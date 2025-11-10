import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X } from "lucide-react";
import { ProdutoFilter } from "@/lib/validations/produto";

interface ProdutosFiltersProps {
  onFilterChange: (filters: ProdutoFilter) => void;
}

const ProdutosFilters = ({ onFilterChange }: ProdutosFiltersProps) => {
  const [filters, setFilters] = useState<ProdutoFilter>({});

  const handleFilterChange = (key: keyof ProdutoFilter, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome_produto">Nome do Produto</Label>
            <Input
              id="nome_produto"
              placeholder="Buscar por nome"
              value={filters.nome_produto || ""}
              onChange={(e) => handleFilterChange("nome_produto", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Input
              id="tipo"
              placeholder="Buscar por tipo"
              value={filters.tipo || ""}
              onChange={(e) => handleFilterChange("tipo", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco_min">Preço Mínimo</Label>
            <Input
              id="preco_min"
              type="number"
              placeholder="0.00"
              value={filters.preco_min || ""}
              onChange={(e) =>
                handleFilterChange("preco_min", parseFloat(e.target.value) || undefined)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco_max">Preço Máximo</Label>
            <Input
              id="preco_max"
              type="number"
              placeholder="0.00"
              value={filters.preco_max || ""}
              onChange={(e) =>
                handleFilterChange("preco_max", parseFloat(e.target.value) || undefined)
              }
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={applyFilters}>
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProdutosFilters;
