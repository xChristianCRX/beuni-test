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
        const { id } = req.params;
        const { status } = req.body;

        try {
            const envio = await prisma.envio.update({
                where: { id },
                data: { status },
            });

            return res.status(200).json(envio);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar status do envio." });
        }
    }

    static async triggerSends(req, res) {
        try {
            const hoje = new Date();
            let diasAdicionados = 0;
            let dataFinal = new Date(hoje);

            while (diasAdicionados < 7) {
                dataFinal = addDays(dataFinal, 1);
                if (!isWeekend(dataFinal)) {
                    diasAdicionados++;
                }
            }

            const aniversariantes = await prisma.aniversariante.findMany();
            const aniversariantesParaEnviar = aniversariantes.filter((a) => {
                const aniversario = new Date(a.dataNascimento);
                aniversario.setFullYear(hoje.getFullYear());

                return aniversario >= hoje && aniversario <= dataFinal;
            });

            const enviosCriados = [];

            for (const aniversariante of aniversariantesParaEnviar) {
                const jaEnviado = await prisma.envio.findFirst({
                    where: {
                        aniversarianteId: aniversariante.id,
                        createdAt: {
                            gte: new Date(hoje.getFullYear(), 0, 1),
                        },
                    },
                });

                if (!jaEnviado) {
                    const envio = await prisma.envio.create({
                        data: {
                            aniversarianteId: aniversariante.id,
                            status: "PENDENTE",
                        },
                    });

                    enviosCriados.push(envio);
                }
            }

            return res.status(200).json({
                message: `${enviosCriados.length} envios criados com sucesso.`,
                envios: enviosCriados,
            });
        } catch (error) {
            console.error("Erro ao disparar envios:", error);
            return res.status(500).json({ message: "Erro ao disparar envios." });
        }
    }
}