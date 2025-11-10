import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Package } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Sistema de Gerenciamento CRUD
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Gerencie seus clientes e produtos de forma simples e eficiente
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border p-8 hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-card-foreground mb-2">
              Clientes
            </h2>
            <p className="text-muted-foreground mb-6">
              Cadastre e gerencie informações completas de seus clientes com
              validações de segurança
            </p>
            <Button onClick={() => navigate("/clientes")} className="w-full">
              Acessar Clientes
            </Button>
          </div>

          <div className="bg-card rounded-lg border p-8 hover:shadow-lg transition-shadow">
            <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-card-foreground mb-2">
              Produtos
            </h2>
            <p className="text-muted-foreground mb-6">
              Controle seu inventário com informações detalhadas de produtos e
              estoque
            </p>
            <Button onClick={() => navigate("/produtos")} className="w-full">
              Acessar Produtos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
