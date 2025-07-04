import { prisma } from "../../prisma/client.js";
import { subDays, addDays, startOfDay, endOfDay } from "date-fns";

export default class BirthdayController {
    static async getAll(req, res) {
        const organizacaoId = req.user.organizacaoId;
        try {
            const birthdays = await prisma.aniversariante.findMany({
                where: { organizacaoId: Number(organizacaoId) },
                include: {
                    departamento: true,
                    organizacao: true,
                    envios: true
                }
            });
            res.json(birthdays);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async findById(req, res) {
        try {
            const { id } = req.params;
            const birthday = await prisma.aniversariante.findUnique({
                where: { id: Number(id) },
                include: { departamento: true, cargo: true }
            });

            if (!birthday) return res.status(404).json({ message: "Aniversariante não encontrado" });

            res.json(birthday);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const {
                nome, data_nascimento, cep, rua,
                numero, complemento, bairro, cidade,
                estado, tamanho_camiseta, departamentoId,
                cargo, organizacaoId
            } = req.body;
            let kitId = null;

            if (!kitId && departamentoId) {
                const departamento = await prisma.departamento.findUnique({
                    where: { id: Number(departamentoId) },
                    include: { kit: true }
                });

                if (departamento?.kit)
                    kitId = departamento.kit.id;
            }

            if (!kitId) {
                const kitPadrao = await prisma.kit.findFirst({
                    where: {
                        nome: { contains: 'padrão', mode: 'insensitive' },
                        departamentos: { some: { organizacaoId: Number(organizacaoId) } }
                    }
                });

                if (kitPadrao)
                    kitId = kitPadrao.id;
            }

            if (!kitId) {
                return res.status(400).json({
                    mensagem: 'Nenhum kit associado foi encontrado. Configure um kit para o cargo, departamento ou kit padrão da organização.'
                });
            }

            const aniversariante = await prisma.aniversariante.create({
                data: {
                    nome,
                    data_nascimento: new Date(data_nascimento),
                    cep,
                    rua,
                    numero,
                    complemento,
                    bairro,
                    cidade,
                    estado,
                    tamanho_camiseta,
                    departamentoId: departamentoId ? Number(departamentoId) : null,
                    cargo,
                    organizacaoId: Number(organizacaoId),
                    envios: {
                        create: {
                            kitId,
                            status: 'pendente',
                            data_disparo: null
                        }
                    }
                }
            });

            const responseJson = {
                id: aniversariante.id,
                nome: aniversariante.nome,
                data_nascimento: aniversariante.data_nascimento,
                endereco: {
                    cep: aniversariante.cep,
                    rua: aniversariante.rua,
                    numero: aniversariante.numero,
                    complemento: aniversariante.complemento,
                    bairro: aniversariante.bairro,
                    cidade: aniversariante.cidade,
                    estado: aniversariante.estado
                },
                departamento_id: aniversariante.departamentoId,
                cargo: aniversariante.cargo,
                tamanho_camiseta: aniversariante.tamanho_camiseta,
                data_criacao: aniversariante.data_criacao
            };

            res.status(201).json(responseJson);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: 'Erro ao criar aniversariante.', detalhes: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const {
                nome, data_nascimento, cep, rua,
                numero, complemento, bairro, cidade,
                estado, tamanho_camiseta, departamentoId,
                cargo, organizacaoId
            } = req.body;

            const aniversarianteExistente = await prisma.aniversariante.findUnique({
                where: { id: Number(id) }
            });

            if (!aniversarianteExistente) {
                return res.status(404).json({ mensagem: 'Aniversariante não encontrado.' });
            }

            let kitId = null;
            if (!kitId && departamentoId) {
                const departamento = await prisma.departamento.findUnique({
                    where: { id: Number(departamentoId) },
                    include: { kit: true }
                });

                if (departamento?.kit) {
                    kitId = departamento.kit.id;
                }
            }

            if (!kitId) {
                const kitPadrao = await prisma.kit.findFirst({
                    where: {
                        nome: { contains: 'padrão', mode: 'insensitive' },
                        departamentos: { some: { organizacaoId: Number(organizacaoId) } }
                    }
                });

                if (kitPadrao) {
                    kitId = kitPadrao.id;
                }
            }

            if (!kitId) {
                return res.status(400).json({
                    mensagem: 'Nenhum kit associado foi encontrado. Configure um kit para o cargo, departamento ou kit padrão da organização.'
                });
            }

            const aniversarianteAtualizado = await prisma.aniversariante.update({
                where: { id: Number(id) },
                data: {
                    nome,
                    data_nascimento: new Date(data_nascimento),
                    cep,
                    rua,
                    numero,
                    complemento,
                    bairro,
                    cidade,
                    estado,
                    tamanho_camiseta,
                    departamentoId: departamentoId ? Number(departamentoId) : null,
                    cargo,
                    organizacaoId: Number(organizacaoId),
                },
                include: {
                    envios: true
                }
            });

            const responseJson = {
                id: aniversarianteAtualizado.id,
                nome: aniversarianteAtualizado.nome,
                data_nascimento: aniversarianteAtualizado.data_nascimento,
                endereco: {
                    cep: aniversarianteAtualizado.cep,
                    rua: aniversarianteAtualizado.rua,
                    numero: aniversarianteAtualizado.numero,
                    complemento: aniversarianteAtualizado.complemento,
                    bairro: aniversarianteAtualizado.bairro,
                    cidade: aniversarianteAtualizado.cidade,
                    estado: aniversarianteAtualizado.estado
                },
                departamento_id: aniversarianteAtualizado.departamentoId,
                cargo: aniversarianteAtualizado.cargo,
                tamanho_camiseta: aniversarianteAtualizado.tamanho_camiseta,
                data_atualizacao: aniversarianteAtualizado.data_atualizacao
            };

            res.status(200).json(responseJson);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: 'Erro ao atualizar aniversariante.', detalhes: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;

            await prisma.envio.deleteMany({
                where: { aniversarianteId: Number(id) }
            });

            await prisma.aniversariante.delete({
                where: { id: Number(id) }
            });

            res.json({ message: "Aniversariante removido com sucesso" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async birthdaysInSevenDays(req, res) {
        try {
            const organizacaoId  = req.user.organizacaoId;

            const hoje = new Date();
            const aniversariantes = await prisma.aniversariante.findMany({
                where: {
                    organizacaoId,
                },
                include: {
                    departamento: true,
                    envios: {
                        orderBy: { data_criacao: "desc" },
                        take: 1,
                        include: {
                            kit: true
                        }
                    }
                }
            });

            const resultado = aniversariantes
                .filter(a => {
                    const nascimento = new Date(a.data_nascimento);
                    nascimento.setFullYear(hoje.getFullYear());
                    if (nascimento < hoje) nascimento.setFullYear(hoje.getFullYear() + 1);

                    const diasRestantes = Math.ceil(
                        (nascimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
                    );

                    return diasRestantes >= 1 && diasRestantes <= 7;
                })
                .map(a => {
                    const envio = a.envios[0];
                    return {
                        id: a.id,
                        nome: a.nome,
                        departamento: a.departamento?.nome || "Sem departamento",
                        data_nascimento: a.data_nascimento,
                        envio_id: envio.id,
                        status_envio: envio?.status || "pendente",
                        kit: envio?.kit
                            ? {
                                id: envio.kit.id,
                                nome: envio.kit.nome
                            }
                            : null
                    };
                });
            return res.status(200).json(resultado);
        } catch (error) {
            console.error("Erro ao buscar aniversariantes:", error);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }
}