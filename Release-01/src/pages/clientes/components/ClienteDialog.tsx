import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ClienteFormData, clienteSchema } from "@/lib/validations/cliente";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { countries, states } from "@/lib/countries";
import { format } from "date-fns";

interface ClienteDialogProps {
  open: boolean;
  onClose: () => void;
  cliente?: any;
}

const ClienteDialog = ({ open, onClose, cliente }: ClienteDialogProps) => {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
  });

  const paisValue = watch("pais");

  useEffect(() => {
    if (cliente) {
      const formData = {
        ...cliente,
        data_nascimento: format(new Date(cliente.data_nascimento), "yyyy-MM-dd"),
        numero: cliente.numero || "",
        cidade: cliente.cidade || "",
        bairro: cliente.bairro || "",
        pais: cliente.pais || "",
        estado: cliente.estado || "",
        rua_avenida: cliente.rua_avenida || "",
      };
      reset(formData);
      setSelectedCountry(cliente.pais || "");
    } else {
      reset({
        nome: "",
        sobrenome: "",
        telefone_ou_email: "",
        genero: "Feminino",
        data_nascimento: "",
        senha: "",
        cidade: "",
        bairro: "",
        pais: "",
        estado: "",
        rua_avenida: "",
        numero: undefined,
      });
      setSelectedCountry("");
    }
  }, [cliente, reset]);

  useEffect(() => {
    if (paisValue) {
      setSelectedCountry(paisValue);
    }
  }, [paisValue]);

  const onSubmit = async (data: ClienteFormData) => {
    setIsLoading(true);

    try {
      const submitData = {
        nome: data.nome,
        sobrenome: data.sobrenome,
        telefone_ou_email: data.telefone_ou_email,
        genero: data.genero,
        data_nascimento: data.data_nascimento,
        senha: data.senha,
        cidade: data.cidade || null,
        bairro: data.bairro || null,
        pais: data.pais || null,
        estado: data.estado || null,
        rua_avenida: data.rua_avenida || null,
        numero: data.numero || null,
      };

      if (cliente) {
        const { error } = await supabase
          .from("clientes")
          .update(submitData)
          .eq("id", cliente.id);

        if (error) throw error;

        toast({
          title: "Cliente atualizado com sucesso",
        });
      } else {
        const { error } = await supabase.from("clientes").insert([submitData]);

        if (error) throw error;

        toast({
          title: "Cliente criado com sucesso",
        });
      }

      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar cliente",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {cliente ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input id="nome" {...register("nome")} />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sobrenome">Sobrenome *</Label>
              <Input id="sobrenome" {...register("sobrenome")} />
              {errors.sobrenome && (
                <p className="text-sm text-destructive">{errors.sobrenome.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone_ou_email">Telefone ou E-mail *</Label>
            <Input id="telefone_ou_email" {...register("telefone_ou_email")} />
            {errors.telefone_ou_email && (
              <p className="text-sm text-destructive">
                {errors.telefone_ou_email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genero">Gênero *</Label>
              <Select
                onValueChange={(value: any) => setValue("genero", value)}
                defaultValue={cliente?.genero || "Feminino"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.genero && (
                <p className="text-sm text-destructive">{errors.genero.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
              <Input
                id="data_nascimento"
                type="date"
                {...register("data_nascimento")}
              />
              {errors.data_nascimento && (
                <p className="text-sm text-destructive">
                  {errors.data_nascimento.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha">Senha *</Label>
            <Input id="senha" type="password" {...register("senha")} />
            {errors.senha && (
              <p className="text-sm text-destructive">{errors.senha.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pais">País</Label>
              <Select
                onValueChange={(value) => {
                  setValue("pais", value);
                  setValue("estado", "");
                }}
                value={paisValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                onValueChange={(value) => setValue("estado", value)}
                value={watch("estado")}
                disabled={!selectedCountry}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCountry &&
                    states[selectedCountry]?.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" {...register("cidade")} />
              {errors.cidade && (
                <p className="text-sm text-destructive">{errors.cidade.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" {...register("bairro")} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="rua_avenida">Rua/Avenida</Label>
              <Input id="rua_avenida" {...register("rua_avenida")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                type="number"
                {...register("numero")}
              />
            </div>
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

export default ClienteDialog;
