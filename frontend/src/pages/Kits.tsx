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
            console.log(res)
            setKits(res.data);
        }

        fetchKits();
    }, []);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Kits Disponíveis</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kits.map(kit => (
                    <div key={kit.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                        <h2 className="text-xl font-semibold text-indigo-600">{kit.nome}</h2>
                        {kit.descricao && <p className="text-gray-500 mb-4">{kit.descricao}</p>}

                        <div className="mt-4">
                            <h3 className="font-medium text-gray-700 mb-2">Produtos:</h3>
                            <ul className="space-y-2">
                                {kit.produtos.map(kp => (
                                    <li
                                        key={kp.produto.id}
                                        className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="text-gray-800 font-semibold">{kp.produto.nome}</p>
                                            {kp.produto.descricao && (
                                                <p className="text-sm text-gray-500">{kp.produto.descricao}</p>
                                            )}
                                        </div>
                                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
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