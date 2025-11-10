import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X } from "lucide-react";
import { ClienteFilter } from "@/lib/validations/cliente";

interface ClientesFiltersProps {
  onFilterChange: (filters: ClienteFilter) => void;
}

const ClientesFilters = ({ onFilterChange }: ClientesFiltersProps) => {
  const [filters, setFilters] = useState<ClienteFilter>({});

  const handleFilterChange = (key: keyof ClienteFilter, value: any) => {
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
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Buscar por nome"
              value={filters.nome || ""}
              onChange={(e) => handleFilterChange("nome", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              placeholder="Buscar por telefone"
              value={filters.telefone || ""}
              onChange={(e) => handleFilterChange("telefone", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genero">Gênero</Label>
            <Select
              value={filters.genero}
              onValueChange={(value) => handleFilterChange("genero", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Feminino">Feminino</SelectItem>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              placeholder="Buscar por cidade"
              value={filters.cidade || ""}
              onChange={(e) => handleFilterChange("cidade", e.target.value)}
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

export default ClientesFilters;
