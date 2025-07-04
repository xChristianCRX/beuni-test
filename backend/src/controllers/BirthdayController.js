import { prisma } from "../../prisma/client.js";

export default class BirthdayController {
    static async getAll(req, res) {
        try {
            const birthdays = await prisma.aniversariante.findMany({
                include: {
                    departamento: true,
                    cargo: true,
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
                cargoId, organizacaoId
            } = req.body;

            let kitId = null;
            if (cargoId) {
                const cargo = await prisma.cargo.findUnique({
                    where: { id: Number(cargoId) },
                    include: { kit: true }
                });

                if (cargo?.kit)
                    kitId = cargo.kit.id;
            }

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
                    cargoId: cargoId ? Number(cargoId) : null,
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
                cargo_id: aniversariante.cargoId,
                tamanho_camiseta: aniversariante.tamanho_camiseta,
                kit_atribuido: {
                    id: kitSelecionado.id,
                    nome: kitSelecionado.nome,
                    descricao: kitSelecionado.descricao
                },
                data_criacao: aniversariante.data_criacao
            };

            res.status(201).json(responseJson);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: 'Erro ao criar aniversariante.', detalhes: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await prisma.aniversariante.delete({
                where: { id: Number(id) }
            });
            res.json({ message: "Aniversariante removido com sucesso" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}