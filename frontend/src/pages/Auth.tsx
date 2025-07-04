import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useContextSelector } from "use-context-selector";
import { AuthContext } from "../contexts/AuthContext";

const loginSchema = z.object({
  username: z.string().min(3, "O usuário deve conter no mínimo 3 caracteres"),
  password: z.string().min(5, "A senha deve conter no mínimo 5 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Auth() {
  const navigate = useNavigate();
  const login = useContextSelector(AuthContext, (context) => context.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginForm) => {
    try {
      await login(data.username, data.password);
      toast.success("Seja bem-vindo!");
      navigate("/departamentos");
    } catch (error: unknown) {
      const err = error as AxiosError;

      if (err.response?.status === 401) {
        toast.error("Usuário ou senha inválidos.");
      } else {
        toast.error("Erro no login. Tente novamente.");
      }
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
          Acesse sua conta
        </h2>

        <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-4">
          <div>
            <Input label="Usuário" {...register("username")} />
            {errors.username && (
              <span className="text-red-500 text-sm">{errors.username.message}</span>
            )}
          </div>

          <div>
            <Input label="Senha" type="password" {...register("password")} />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#D35400] text-white py-2 rounded-lg font-semibold hover:bg-[#a63e00] transition"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Beuni Tecnologia
        </p>
      </motion.div>
    </div>
  );
}
