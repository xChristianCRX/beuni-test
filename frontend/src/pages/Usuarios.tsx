import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { api } from "@/libs/axios";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, UserPlus, Repeat } from "lucide-react";
import toast from "react-hot-toast";
import { useContextSelector } from "use-context-selector";
import { AuthContext } from "@/contexts/AuthContext";

interface Usuario {
    id: number;
    nome: string;
    email: string;
    status: "ativo" | "pendente";
    data_criacao: string;
    convidadoPor?: { nome: string };
}

const MySwal = withReactContent(Swal);
type StatusFilter = "todos" | "ativo" | "pendente";

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");

    const userLogado = useContextSelector(AuthContext, (ctx) => ctx.user);

    useEffect(() => {
        if (userLogado?.organizationId) {
            loadUsuarios();
        }
    }, []);

    function loadUsuarios() {
        if (!userLogado?.organizationId) return;
        api.get("/usuarios", {
            params: {
                organizacaoId: userLogado.organizationId,
            },
        })
            .then((res) => {
                setUsuarios(res.data);
            });
    }

    async function handleInvite() {
        const { value: email } = await MySwal.fire({
            title: "Convidar novo usuário",
            input: "email",
            inputLabel: "E-mail do novo usuário",
            inputPlaceholder: "exemplo@empresa.com",
            confirmButtonText: "Enviar convite",
            confirmButtonColor: "#FF9913",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            inputValidator: (value: string) => {
                if (!value) return "Você precisa digitar um e-mail.";
            },
        });

        if (!email) return;

        api
            .post("/usuarios/convidar", { email })
            .then(() => toast.success("Convite enviado com sucesso!"))
            .catch(() => toast.error("Erro ao enviar convite."));
    }

    function handleDelete(id: number) {
        api.delete(`/usuarios/${id}`)
            .then(() => {
                toast.success("Usuário removido");
                loadUsuarios();
            })
            .catch(() => toast.error("Erro ao remover usuário"));
    }

    function handleReenviarConvite(email: string) {
        api.post("/usuarios/convidar", { email })
            .then(() => toast.success("Convite reenviado"))
            .catch(() => toast.error("Erro ao reenviar convite"));
    }

    const usuariosFiltrados =
        statusFilter === "todos"
            ? usuarios
            : usuarios.filter((u) => u.status === statusFilter);

    return (
        <div className="p-8 bg-orange-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-orange-700">Usuários</h1>
                <Button
                    onClick={handleInvite}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Convidar Usuário
                </Button>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Filtrar por status:</span>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-white shadow rounded-xl overflow-x-auto">
                <table className="min-w-full table-auto border border-orange-200">
                    <thead className="bg-orange-100">
                        <tr className="text-left text-sm text-gray-700">
                            <th className="p-4">Nome</th>
                            <th className="p-4">E-mail</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Criado por</th>
                            <th className="p-4">Data de criação</th>
                            <th className="p-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.map((user) => (
                            <tr
                                key={user.id}
                                className="border-t border-orange-100 text-sm text-gray-800"
                            >
                                <td className="p-4">{user.nome}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4 capitalize">{user.status}</td>
                                <td className="p-4">{user.convidadoPor?.nome || "-"}</td>
                                <td className="p-4">{new Date(user.data_criacao).toLocaleDateString()}</td>
                                <td className="p-4 text-right space-x-2">
                                    {user.status === "pendente" && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleReenviarConvite(user.email)}
                                        >
                                            <Repeat className="w-4 h-4 mr-1" />
                                            Reenviar convite
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Remover
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {usuariosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center p-4 text-gray-500">
                                    Nenhum usuário encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}