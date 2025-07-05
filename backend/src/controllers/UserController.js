import bcrypt from "bcryptjs";
import { prisma } from "../../prisma/client.js";

export default class UserController {
    static async getAll(req, res) {
        try {
            const organizacaoId = req.user.organizacaoId;
            console.log(organizacaoId)
            const usuarios = await prisma.usuario.findMany({
                where: {
                    organizacaoId: Number(organizacaoId),
                },
                include: {
                    convite: {
                        select: {
                            status: true,
                        },
                    },
                },
            });

            const usuariosFormatados = usuarios.map((u) => ({
                id: u.id,
                nome: u.nome,
                email: u.email,
                status: u.convite?.status || "ativo",
                data_criacao: u.data_criacao,
            }));

            res.status(200).json(usuariosFormatados);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome } = req.body;

            const usuario = await prisma.usuario.findUnique({ where: { id: Number(id) } });
            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            const usuarioAtualizado = await prisma.usuario.update({
                where: { id: Number(id) },
                data: {
                    nome,
                    data_atualizacao: new Date()
                }
            });

            res.status(200).json(usuarioAtualizado);
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            res.status(500).json({ message: "Erro ao atualizar usuário." });
        }
    }

    static async registrar(req, res) {
        try {
            const { nome, senha, token } = req.body;

            const convite = await prisma.convite.findUnique({ where: { token } });

            if (!convite || convite.status !== "pendente" || new Date() > convite.data_validade) {
                return res.status(400).json({ message: "Convite inválido ou expirado." });
            }

            const senha_hash = await bcrypt.hash(senha, 10);

            const usuarioCriado = await prisma.usuario.create({
                data: {
                    nome,
                    email: convite.email,
                    senha_hash,
                    organizacaoId: convite.organizacaoId
                }
            });

            await prisma.convite.update({
                where: { token },
                data: { status: "aceito" }
            });

            return res.status(201).json({ message: "Usuário registrado com sucesso!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao registrar usuário." });
        }
    }

    static async convidar(req, res) {
        try {
            const { email } = req.body;
            const existe = await prisma.usuario.findUnique({ where: { email } });
            if (existe) {
                return res.status(400).json({ message: "Usuário já registrado com este e-mail." });
            }

            const token = uuidv4();
            const validade = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

            const convite = await prisma.convite.create({
                data: {
                    email,
                    token,
                    organizacaoId: Number(organizacaoId),
                    data_validade: validade
                }
            });
            const link = `https://seusite.com/registro?token=${token}`;
            return res.status(200).json({ message: "Convite enviado para " + email });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao convidar usuário." });
        }
    }

    static async validarConvite(req, res) {
        try {
            const { token } = req.query;
            const convite = await prisma.convite.findUnique({ where: { token } });

            if (!convite || convite.status !== "pendente" || new Date() > convite.data_validade) {
                return res.status(400).json({ message: "Convite inválido ou expirado." });
            }

            return res.status(200).json({
                email: convite.email,
                organizacaoId: convite.organizacaoId,
                status: convite.status,
                conviteId: convite.id
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao validar convite." });
        }
    }
}