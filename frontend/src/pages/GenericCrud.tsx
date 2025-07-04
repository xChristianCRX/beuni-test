import { useEffect, useState } from "react";
import { api } from "@/libs/axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

type FormData = z.infer<typeof schema>;

interface Item {
  id: string;
  name: string;
}

interface GenericCrudProps {
  title: string;
  endpoint: string; // Ex: "/departamentos"
}

export default function GenericCrud({ title, endpoint }: GenericCrudProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const fetchItems = async () => {
    const res = await api.get(endpoint);
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  const onSubmit = async (data: FormData) => {
    try {
      if (editingItem) {
        await api.put(`${endpoint}/${editingItem.id}`, data);
        toast.success("Item atualizado!");
      } else {
        await api.post(endpoint, data);
        toast.success("Item criado!");
      }

      fetchItems();
      setOpen(false);
      reset();
      setEditingItem(null);
    } catch (e) {
      toast.error("Erro ao salvar item.");
      console.error(e);
    }
  };

  const onEdit = (item: Item) => {
    setEditingItem(item);
    setValue("name", item.name);
    setOpen(true);
  };

  const onDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este item?")) {
      try {
        await api.delete(`${endpoint}/${id}`);
        toast.success("Item removido!");
        fetchItems();
      } catch (e) {
        toast.error("Erro ao remover item.");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#3E2C1C]">{title}</h1>
        <Dialog open={open} onOpenChange={(v) => {
          if (!v) {
            reset();
            setEditingItem(null);
          }
          setOpen(v);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#D35400] hover:bg-[#b43e00]">
              <Plus className="mr-2" size={18} />
              {editingItem ? "Editar" : "Adicionar"} {title.slice(0, -1)}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Editar" : "Novo"} {title.slice(0, -1)}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <Label>Nome</Label>
                <Input {...register("name")} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <Button type="submit" className="bg-[#D35400] hover:bg-[#b43e00]">
                Salvar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Lista de {title.toLowerCase()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b py-2">
                <span>{item.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:bg-blue-100"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">Nenhum item encontrado.</span>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
