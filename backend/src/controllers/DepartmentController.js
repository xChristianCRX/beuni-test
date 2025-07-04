import { prisma } from "../../prisma/client.js";

export default class DepartmentController {
    static async getAll(req, res) {
        try {
            const departamentos = await prisma.departamento.findMany({
                include: { organizacao: true }
            });
            res.json(departamentos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { name, kitId } = req.body;
            const department = await prisma.departamento.create({
                data: {
                    nome,
                    kitId: Number(kitId)
                }
            });
            res.status(201).json(department);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await prisma.departamento.delete({
                where: { id: Number(id) }
            });
            res.json({ message: "Departamento removido com sucesso" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, email } = req.body;

            const usuario = await prisma.usuario.findUnique({ where: { id: Number(id) } });
            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            const usuarioAtualizado = await prisma.usuario.update({
                where: { id: Number(id) },
                data: {
                    nome,
                    email,
                    data_atualizacao: new Date()
                }
            });

            res.status(200).json(usuarioAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            res.status(500).json({ message: "Erro ao atualizar usuário." });
        }
    }
}