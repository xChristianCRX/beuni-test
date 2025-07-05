import { prisma } from "../../prisma/client.js";
import { isWeekend, addDays } from 'date-fns';

export default class SendController {
    static async getAll(req, res) {
        try {
            const envios = await prisma.envio.findMany({
                include: {
                    aniversariante: true,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            });

            return res.status(200).json(envios);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar envios." });
        }
    }

    static async updateBirthdayStatus(req, res) {
        try {
            const { envioId, novoStatus } = req.body;

            const envioAtualizado = await prisma.envio.update({
                where: { id: envioId },
                data: {
                    status: novoStatus,
                    data_atualizacao: new Date()
                }
            });

            return res.status(200).json(envioAtualizado);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Erro ao atualizar envio." });
        }
    }
}