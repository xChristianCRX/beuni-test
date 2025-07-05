import { useEffect, useState } from "react";
import { api } from "@/libs/axios";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import toast from "react-hot-toast";
import ModalAniversariante from "@/components/ModalAniversariante";
import Swal from "sweetalert2";

interface Departamento {
  id: number;
  nome: string;
}

interface Aniversariante {
  id: number;
  nome: string;
  data_nascimento: string;
  departamentoId: number;
  departamento: { nome: string };
  cargo: string;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  tamanho_camiseta: string;
  email?: string;
  telefone?: string;
  observacoes?: string;
}

export default function Aniversariantes() {
  const [listaCompleta, setListaCompleta] = useState<Aniversariante[]>([]);
  const [listaFiltrada, setListaFiltrada] = useState<Aniversariante[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Aniversariante | null>(null);

  const [departamentoFiltro, setDepartamentoFiltro] = useState<string>("todos");
  const [mesFiltro, setMesFiltro] = useState<string>("todos");

  const load = async () => {
    const [resAniversariantes, resDepartamentos] = await Promise.all([
      api.get("/aniversariantes"),
      api.get("/departamentos"),
    ]);
    setListaCompleta(resAniversariantes.data);
    setDepartamentos(resDepartamentos.data);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let filtrado = listaCompleta;

    if (departamentoFiltro !== "todos") {
      filtrado = filtrado.filter(
        (a) => a.departamentoId === parseInt(departamentoFiltro)
      );
    }

    if (mesFiltro !== "todos") {
      filtrado = filtrado.filter(
        (a) => new Date(a.data_nascimento).getMonth() === parseInt(mesFiltro)
      );
    }

    setListaFiltrada(filtrado);
  }, [departamentoFiltro, mesFiltro, listaCompleta]);

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Deseja realmente excluir este aniversariante?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`/aniversariantes/${id}`)
          .then(() => {
            toast.success("Aniversariante removido");
            load();
          })
          .catch(() => {
            toast.error("Erro ao remover aniversariante");
          });
      }
    });
  };

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700">Aniversariantes</h1>
        <Button
          className="bg-orange-600 text-white"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          + Adicionar
        </Button>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">
            Filtrar por departamento:
          </label>
          <select
            value={departamentoFiltro}
            onChange={(e) => setDepartamentoFiltro(e.target.value)}
            className="px-3 py-2 border rounded shadow-sm bg-white"
          >
            <option value="todos">Todos</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">
            Filtrar por mês de nascimento:
          </label>
          <select
            value={mesFiltro}
            onChange={(e) => setMesFiltro(e.target.value)}
            className="px-3 py-2 border rounded shadow-sm bg-white"
          >
            <option value="todos">Todos</option>
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i}>
                {new Date(2023, i, 1).toLocaleString("pt-BR", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listaFiltrada.map((aniv) => (
          <div key={aniv.id} className="bg-white p-6 rounded-xl border shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-orange-800">{aniv.nome}</h2>
                <p className="text-sm text-gray-600">
                  {aniv.departamento.nome} — {aniv.cargo}
                </p>
                <p className="text-sm text-gray-500">
                  Nascimento: {new Date(aniv.data_nascimento).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditing(aniv);
                    setModalOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4 text-orange-600" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(aniv.id)}
                >
                  <Trash className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ModalAniversariante
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={async () => {
          await load();
          setModalOpen(false);
          setEditing(null);
        }}
        departamentos={departamentos}
        defaultValues={editing || undefined}
      />
    </div>
  );
}