import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/libs/axios"

interface Aniversariante {
  id: number
  nome: string
  data_nascimento: string
  cidade: string
  estado: string
}

export default function AniversariantesPage() {
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState<Partial<Aniversariante>>({})

  useEffect(() => {
    fetchAniversariantes()
  }, [])

  const fetchAniversariantes = async () => {
    const res = await api.get("/aniversariantes")
    setAniversariantes(res.data)
  }

  const handleDelete = async (id: number) => {
    await api.delete(`/aniversariantes/${id}`)
    fetchAniversariantes()
  }

  const handleSubmit = async () => {
    if (form.id) {
      await api.put(`/aniversariantes/${form.id}`, form)
    } else {
      await api.post("/aniversariantes", form)
    }
    setIsOpen(false)
    setForm({})
    fetchAniversariantes()
  }

  const handleEdit = (aniversariante: Aniversariante) => {
    setForm(aniversariante)
    setIsOpen(true)
  }

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-600">Aniversariantes</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">+ Novo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-orange-600">
                {form?.id ? "Editar Aniversariante" : "Novo Aniversariante"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome</Label>
                  <Input
                    value={form.nome || ""}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
                    value={form.data_nascimento?.slice(0, 10) || ""}
                    onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cidade</Label>
                  <Input
                    value={form.cidade || ""}
                    onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Input
                    value={form.estado || ""}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleSubmit}
              >
                {form?.id ? "Salvar Alterações" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-orange-700">
              <th className="py-2">Nome</th>
              <th>Data de Nascimento</th>
              <th>Cidade</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {aniversariantes.map((a) => (
              <tr key={a.id} className="border-t border-orange-100">
                <td className="py-2">{a.nome}</td>
                <td>{new Date(a.data_nascimento).toLocaleDateString("pt-BR")}</td>
                <td>{a.cidade}</td>
                <td>{a.estado}</td>
                <td>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="text-orange-600 border-orange-300 hover:bg-orange-100"
                      onClick={() => handleEdit(a)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(a.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {aniversariantes.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-6">
                  Nenhum aniversariante encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
