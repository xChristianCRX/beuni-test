import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { nome: string; kitId: number }) => void;
  kits: { id: number; nome: string }[];
  defaultValues?: { nome: string; kitId: number };
  editing?: boolean;
}

export function DepartamentoModal({ open, onClose, onSubmit, kits, defaultValues, editing }: Props) {
  const [nome, setNome] = useState(defaultValues?.nome || "");
  const [kitId, setKitId] = useState(defaultValues?.kitId?.toString() || "");

  useEffect(() => {
    setNome(defaultValues?.nome || "");
    setKitId(defaultValues?.kitId?.toString() || "");
  }, [defaultValues]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !kitId) return;
    onSubmit({ nome, kitId: parseInt(kitId) });
    setNome("");
    setKitId("");
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl p-6 border-orange-200">
        <DialogHeader>
          <DialogTitle className="text-orange-600 text-lg font-semibold">
            {editing ? "Editar Departamento" : "Adicionar Departamento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="nome" className="text-orange-800">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome"
            />
          </div>

          <div>
            <Label htmlFor="kit" className="text-orange-800">Kit Vinculado</Label>
            <Select value={kitId} onValueChange={setKitId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um kit" />
              </SelectTrigger>
              <SelectContent>
                {kits.map((kit) => (
                  <SelectItem key={kit.id} value={kit.id.toString()}>
                    {kit.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
              {editing ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}