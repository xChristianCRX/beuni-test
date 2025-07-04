import { useEffect, useState } from "react";
import { api } from "@/libs/axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash } from "lucide-react";
import toast from "react-hot-toast";

interface Cargo {
  id: number;
  nome: string;
  kitId?: number;
  kit?: { nome: string };
}

interface Kit {
  id: number;
  nome: string;
}

export default function Cargos() {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Cargo | null>(null);
  const [nome, setNome] = useState("");
  const [kitId, setKitId] = useState("");

  async function load() {
    const [cargosRes, kitsRes] = await Promise.all([
      api.get("/cargos"),
      api.get("/kits")
    ]);
    setCargos(cargosRes.data);
    setKits(kitsRes.data);
  }

  useEffect(() => {
    load();
  }, []);

  function openModal(cargo?: Cargo) {
    if (cargo) {
      setEditing(cargo);
      setNome(cargo.nome);
      setKitId(cargo.kitId?.toString() || "");
    } else {
      setEditing(null);
      setNome("");
      setKitId("");
    }
    setModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = { nome, kitId: parseInt(kitId) };
    if (editing) {
      api.put(`/cargos/${editing.id}`, data).then(() => {
        toast.success("Cargo atualizado");
        setModalOpen(false);
        load();
      });
    } else {
      api.post("/cargos", data).then(() => {
        toast.success("Cargo criado");
        setModalOpen(false);
        load();
      });
    }
  }

  function handleDelete(id: number) {
    if (confirm("Deseja excluir este cargo?")) {
      api.delete(`/cargos/${id}`).then(() => {
        toast.success("Cargo removido");
        load();
      });
    }
  }

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700">Cargos</h1>
        <Button onClick={() => openModal()} className="bg-orange-600 hover:bg-orange-700 text-white">
          + Adicionar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cargos.map((cargo) => (
          <div
            key={cargo.id}
            className="bg-white rounded-xl p-6 shadow border border-orange-200"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-orange-700">{cargo.nome}</h2>
                <p className="text-sm text-gray-500">
                  Kit: {cargo.kit?.nome || "Não vinculado"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openModal(cargo)}>
                  <Pencil className="w-4 h-4 text-orange-600" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(cargo.id)}>
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="rounded-xl p-6 border-orange-200">
          <DialogHeader>
            <DialogTitle className="text-orange-600 text-lg font-semibold">
              {editing ? "Editar Cargo" : "Adicionar Cargo"}
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
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                {editing ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}