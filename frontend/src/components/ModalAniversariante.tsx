import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/libs/axios";
import toast from "react-hot-toast";
import { useContextSelector } from "use-context-selector";
import { AuthContext } from "@/contexts/AuthContext";

interface Departamento {
    id: number;
    nome: string;
}

interface AniversarianteForm {
    nome: string;
    data_nascimento: string;
    departamentoId: number;
    cargo: string;
    organizacaoId: string;
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

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    defaultValues?: Partial<AniversarianteForm & { id: number }>;
    departamentos: Departamento[];
}

export default function AniversarianteModal({ open, onClose, onSubmit, defaultValues, departamentos }: Props) {
    const user = useContextSelector(AuthContext, (ctx) => ctx.user);
    const [form, setForm] = useState<AniversarianteForm>({
        nome: "",
        organizacaoId: user?.organizationId || "",
        data_nascimento: "",
        departamentoId: 0,
        cargo: "",
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        tamanho_camiseta: "",
        email: "",
        telefone: "",
        observacoes: ""
    });

    useEffect(() => {
        if (defaultValues) {
            setForm({ ...form, ...defaultValues });
        }
    }, [defaultValues]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const buscarEnderecoPorCep = async () => {
        if (form.cep.length !== 8) return;
        try {
            const res = await fetch(`https://viacep.com.br/ws/${form.cep}/json/`);
            const data = await res.json();
            if (data.erro) throw new Error("CEP inválido");
            setForm((prev) => ({
                ...prev,
                rua: data.logradouro,
                bairro: data.bairro,
                cidade: data.localidade,
                estado: data.uf,
            }));
        } catch {
            toast.error("Erro ao buscar endereço. Verifique o CEP.");
        }
    };

    const handleSubmit = async () => {
        const method = defaultValues?.id ? "put" : "post";
        const url = defaultValues?.id ? `/aniversariantes/${defaultValues.id}` : "/aniversariantes";
        try {
            await api[method](url, form);
            toast.success(defaultValues?.id ? "Aniversariante atualizado" : "Aniversariante cadastrado");
            onSubmit();
        } catch (err) {
            toast.error("Erro ao salvar aniversariante");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{defaultValues ? "Editar Aniversariante" : "Novo Aniversariante"}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <Input name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} />
                    <Input name="data_nascimento" type="date" value={form.data_nascimento} onChange={handleChange} />

                    <select name="departamentoId" value={form.departamentoId} onChange={handleChange} className="border rounded p-2">
                        <option value={0}>Selecione um departamento</option>
                        {departamentos.map((dep) => (
                            <option key={dep.id} value={dep.id}>{dep.nome}</option>
                        ))}
                    </select>

                    <Input name="cargo" placeholder="Cargo" value={form.cargo} onChange={handleChange} />
                    <Input name="cep" placeholder="CEP" value={form.cep} onChange={handleChange} onBlur={buscarEnderecoPorCep} />
                    <Input name="rua" placeholder="Rua" value={form.rua} onChange={handleChange} />

                    <Input name="numero" placeholder="Número" value={form.numero} onChange={handleChange} />
                    <Input name="complemento" placeholder="Complemento" value={form.complemento} onChange={handleChange} />

                    <Input name="bairro" placeholder="Bairro" value={form.bairro} onChange={handleChange} />
                    <Input name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} />

                    <Input name="estado" placeholder="Estado" value={form.estado} onChange={handleChange} />
                    <Input name="tamanho_camiseta" placeholder="Tamanho da camiseta (ex: M)" value={form.tamanho_camiseta} onChange={handleChange} />

                    <Input name="email" placeholder="Email (opcional)" value={form.email} onChange={handleChange} />
                    <Input name="telefone" placeholder="Telefone (opcional)" value={form.telefone} onChange={handleChange} />

                    <Input name="observacoes" placeholder="Observações (opcional)" value={form.observacoes} onChange={handleChange} />
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button className="bg-orange-600 text-white" onClick={handleSubmit}>
                        {defaultValues ? "Salvar alterações" : "Cadastrar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}