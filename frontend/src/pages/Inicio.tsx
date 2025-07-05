import { useEffect, useState } from "react";
import { api } from "@/libs/axios";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Aniversariante = {
  id: number;
  nome: string;
  departamento: string;
  data_nascimento: string;
  envio_id: number;
  status_envio: string;
  kit: {
    id: number;
    nome: string;
  } | null;
};

export default function Inicio() {
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);

  const buscarAniversariantes = async () => {
    try {
      const response = await api.get("/aniversariantes/proximos");
      setAniversariantes(response.data);
    } catch {
      toast.error("Erro ao buscar aniversariantes.");
    }
  };

  const atualizarStatus = async (envioId: number, novoStatus: string) => {
    try {
      await api.put("/envios/atualizar-status", {
        envioId,
        novoStatus,
      });
      toast.success("Status atualizado com sucesso!");
      buscarAniversariantes();
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  };

  useEffect(() => {
    buscarAniversariantes();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-[#fff7f0]">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-[#D35400]">
          Be<span className="text-yellow-500">uni</span> Tecnologia
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Visão geral de aniversariantes e envios</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-xl border border-orange-100">
        <h2 className="text-2xl font-bold text-[#D35400] mb-4">
          Aniversariantes Próximos (até 7 dias)
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {aniversariantes.length === 0 ? (
            <p className="text-gray-600 text-sm col-span-full">
              Nenhum aniversariante nos próximos 7 dias.
            </p>
          ) : (
            aniversariantes.map((a) => (
              <div
                key={a.id}
                className="border border-orange-200 rounded-xl p-4 bg-[#fffdfb] shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-[#3E2C1C]">{a.nome}</span>
                  <span className="text-sm text-orange-500 font-medium">
                    🎂 {format(new Date(a.data_nascimento), "dd 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  <strong>Departamento:</strong> {a.departamento}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  <strong>Kit:</strong>{" "}
                  {a.kit ? (
                    <span className="text-[#D35400] font-medium">{a.kit.nome}</span>
                  ) : (
                    <span className="text-gray-400 italic">Não atribuído</span>
                  )}
                </p>

                <div className="mt-3">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Status de envio:
                  </label>
                  <select
                    className="w-full border border-orange-300 rounded-md px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={a.status_envio}
                    onChange={(e) => atualizarStatus(a.envio_id, e.target.value)}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregue">Entregue</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="text-center mt-10 text-sm text-gray-400">
        © {new Date().getFullYear()} Beuni Tecnologia
      </footer>
    </div>
  );
}