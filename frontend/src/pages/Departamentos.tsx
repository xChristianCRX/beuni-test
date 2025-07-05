import { useEffect, useState } from "react";
import { api } from "@/libs/axios";
import { Button } from "@/components/ui/button";
import { DepartamentoModal } from "@/components/ModalDepartamento";
import { Pencil, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "@/contexts/AuthContext";
import { useContextSelector } from "use-context-selector";
import Swal from "sweetalert2";

interface Departamento {
    id: number;
    nome: string;
    kitId?: number;
    kit?: { nome: string };
}

interface Kit {
    id: number;
    nome: string;
}

// Este tipo representa os dados vindos do formulário (sem organizacaoId)
interface DepartamentoFormData {
    nome: string;
    kitId: number;
}

export default function Departamentos() {
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [kits, setKits] = useState<Kit[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Departamento | null>(null);

    const user = useContextSelector(AuthContext, (ctx) => ctx.user);

    async function load() {
        const [depRes, kitsRes] = await Promise.all([
            api.get("/departamentos"),
            api.get("/kits"),
        ]);
        setDepartamentos(depRes.data);
        setKits(kitsRes.data);
    }

    useEffect(() => {
        load();
    }, []);

    function handleCreate(data: DepartamentoFormData) {
        if (!user?.organizationId) {
            toast.error("Organização não identificada.");
            return;
        }

        const payload = {
            ...data,
            organizacaoId: user.organizationId,
        };

        if (editing) {
            api.put(`/departamentos/${editing.id}`, payload).then(() => {
                toast.success("Departamento atualizado com sucesso");
                setEditing(null);
                setModalOpen(false);
                load();
            });
        } else {
            api.post("/departamentos", payload).then(() => {
                toast.success("Departamento criado");
                setModalOpen(false);
                load();
            });
        }
    }

    function handleDelete(id: number) {
        Swal.fire({
            title: "Tem certeza?",
            text: "Essa ação não pode ser desfeita!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/departamentos/${id}`).then(() => {
                    toast.success("Departamento removido");
                    load();
                });
            }
        });
    }


    return (
        <div className="p-8 bg-orange-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-orange-700">Departamentos</h1>
                <Button
                    onClick={() => {
                        setEditing(null);
                        setModalOpen(true);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                    + Adicionar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departamentos.map((dep) => (
                    <div
                        key={dep.id}
                        className="bg-white rounded-xl p-6 shadow border border-orange-200"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-orange-700">{dep.nome}</h2>
                                <p className="text-sm text-gray-500">
                                    Kit: {dep.kit?.nome || "Não vinculado"}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setEditing(dep);
                                        setModalOpen(true);
                                    }}
                                >
                                    <Pencil className="w-4 h-4 text-orange-600" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDelete(dep.id)}
                                >
                                    <Trash className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <DepartamentoModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditing(null);
                }}
                onSubmit={handleCreate}
                kits={kits}
                editing={!!editing}
                defaultValues={
                    editing ? { nome: editing.nome, kitId: editing.kitId || 0 } : undefined
                }
            />
        </div>
    );
}