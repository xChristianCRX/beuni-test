import { useEffect, useState } from "react";
import { api } from "../libs/axios";

interface Produto {
  id: number;
  nome: string;
  descricao?: string;
}

interface KitProduto {
  kitId: number;
  produtoId: number;
  quantidade: number;
  produto: Produto;
}

interface Kit {
  id: number;
  nome: string;
  descricao?: string;
  produtos: KitProduto[];
}

export default function Kits() {
  const [kits, setKits] = useState<Kit[]>([]);

  useEffect(() => {
    async function fetchKits() {
      const res = await api.get("/kits");
      setKits(res.data);
    }

    fetchKits();
  }, []);

  return (
    <div className="p-8 bg-orange-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-orange-700">Kits Disponíveis</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {kits.map((kit) => (
          <div
            key={kit.id}
            className="bg-white rounded-2xl shadow-xl border border-orange-200 p-6 transition hover:shadow-2xl"
          >
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-orange-700">{kit.nome}</h2>
              {kit.descricao && (
                <p className="text-gray-500 text-sm mt-1">{kit.descricao}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Produtos incluídos:</h3>
              <ul className="space-y-2">
                {kit.produtos.map((kp) => (
                  <li
                    key={kp.produto.id}
                    className="bg-orange-100/40 border border-orange-200 p-3 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <p className="text-orange-800 font-medium">{kp.produto.nome}</p>
                      {kp.produto.descricao && (
                        <p className="text-sm text-gray-600">{kp.produto.descricao}</p>
                      )}
                    </div>
                    <span className="text-sm bg-orange-600 text-white px-3 py-1 rounded-full font-semibold">
                      x{kp.quantidade}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}