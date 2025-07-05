import { prisma } from "../../prisma/client.js";

export default class DepartmentController {
    static async getAll(req, res) {
        const organizacaoId = req.user.organizacaoId;

        try {
            const departamentos = await prisma.departamento.findMany({
                where: { organizacaoId: Number(organizacaoId) },
                include: { kit: true }
            });
            res.json(departamentos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { nome, kitId, organizacaoId } = req.body;
            const departamento = await prisma.departamento.create({
                data: {
                    nome,
                    kitId: Number(kitId),
                    organizacaoId: Number(organizacaoId)
                }
            });
            res.status(201).json(departamento);
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
            const { nome, kitId } = req.body;

            const departamento = await prisma.departamento.findUnique({ where: { id: Number(id) } });
            if (!departamento) {
                return res.status(404).json({ message: "Departamento não encontrado." });
            }

            const departamentoAtualizado = await prisma.departamento.update({
                where: { id: Number(id) },
                data: {
                    nome,
                    kitId,
                    data_atualizacao: new Date()
                }
            });

            res.status(200).json(departamentoAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar departamento:", error);
            res.status(500).json({ message: "Erro ao atualizar departamento." });
        }
    }
}