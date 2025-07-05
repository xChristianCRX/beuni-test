// src/pages/Register.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { toast } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/libs/axios";

const registerSchema = z
    .object({
        nome: z.string().min(3, "O nome deve conter no mínimo 3 caracteres"),
        senha: z.string().min(5, "A senha deve conter no mínimo 5 caracteres"),
        confirmarSenha: z.string(),
    })
    .refine((data) => data.senha === data.confirmarSenha, {
        message: "As senhas não coincidem",
        path: ["confirmarSenha"],
    });

type RegisterForm = z.infer<typeof registerSchema>;

export default function Registro() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const handleRegister = async (data: RegisterForm) => {
        if (!token) {
            toast.error("Token de convite ausente.");
            return;
        }

        try {
            await api.post("/usuarios/registro", {
                ...data,
                token,
            });

            toast.success("Cadastro realizado com sucesso!");
            navigate("/");
        } catch {
            toast.error("Erro ao registrar. Tente novamente.");
        }
    };

    return (
        <div className="h-screen w-screen bg-[#fef7f0] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-[#ff7f50]/20"
            >
                <h1 className="text-4xl font-extrabold text-center text-[#D35400] mb-6">
                    Be<span className="text-yellow-500">uni</span>
                </h1>

                <h2 className="text-xl font-medium text-center text-[#3E2C1C] mb-6">
                    Criar sua conta
                </h2>

                <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col gap-4">
                    <div>
                        <Input label="Nome completo" {...register("nome")} />
                        {errors.nome && <span className="text-red-500 text-sm">{errors.nome.message}</span>}
                    </div>

                    <div>
                        <Input label="Senha" type="password" {...register("senha")} />
                        {errors.senha && <span className="text-red-500 text-sm">{errors.senha.message}</span>}
                    </div>

                    <div>
                        <Input label="Confirmar senha" type="password" {...register("confirmarSenha")} />
                        {errors.confirmarSenha && (
                            <span className="text-red-500 text-sm">{errors.confirmarSenha.message}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-[#D35400] text-white py-2 rounded-lg font-semibold hover:bg-[#a63e00] transition"
                    >
                        Registrar
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    © {new Date().getFullYear()} Beuni Tecnologia
                </p>
            </motion.div>
        </div>
    );
}