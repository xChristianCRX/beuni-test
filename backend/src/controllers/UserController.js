import bcrypt from "bcryptjs";
import { prisma } from "../../prisma/client.js";
import jwt from "jsonwebtoken";
import { transporter } from "../../utils/emailService.js";

export default class UserController {
    static async getAll(req, res) {
        try {
            const organizacaoId = req.user.organizacaoId;

            const usuarios = await prisma.usuario.findMany({
                where: {
                    organizacaoId: Number(organizacaoId),
                },
            });

            const convites = await prisma.convite.findMany({
                where: {
                    organizacaoId: Number(organizacaoId),
                    status: 'pendente',
                },
            });

            const usuariosAtivos = usuarios.map((u) => ({
                id: u.id,
                nome: u.nome,
                email: u.email,
                status: 'ativo',
                data_criacao: u.data_criacao,
                tipo: 'usuario',
            }));

            const convitesPendentes = convites.map((c) => ({
                id: c.id,
                nome: null,
                email: c.emailConvidado,
                status: 'pendente',
                data_criacao: c.data_criacao,
                tipo: 'convite',
            }));

            const resultado = [...usuariosAtivos, ...convitesPendentes];
            res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
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
                return res.status(400).json({ message: "Token inválido ou expirado." });
            }

            const senhaHash = await bcrypt.hash(senha, 10);
            const novoUsuario = await prisma.usuario.create({
                data: {
                    nome,
                    email: convite.emailConvidado,
                    senha_hash: senhaHash,
                    organizacaoId: convite.organizacaoId,
                    convidadoPorId: convite.usuario_envio
                }
            });

            await prisma.convite.update({
                where: { token },
                data: { status: "aceito" }
            });

            res.status(201).json({ message: "Usuário registrado com sucesso!", usuario: novoUsuario });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao registrar usuário." });
        }
    }

    static async convidar(req, res) {
        try {
            const { email } = req.body;
            const organizacaoId = req.user.organizacaoId;

            const existe = await prisma.usuario.findFirst({
                where: {
                    AND: [
                        { email: email },
                        { organizacaoId: organizacaoId }
                    ]
                }
            });
            if (existe)
                return res.status(400).json({ message: "Usuário já registrado com este e-mail." });

            const usuario = req.user;
            const token = jwt.sign(
                {
                    email,
                    organizacaoId: usuario.organizacaoId
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            const validade = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await prisma.convite.create({
                data: {
                    emailConvidado: email,
                    token,
                    data_validade: validade,
                    organizacaoId: usuario.organizacaoId,
                    enviadoPorId: usuario.id
                }
            });

            const link = `http://localhost:5173/registro?token=${token}`;
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: email,
                subject: "Convite para acesso ao sistema Beuni",
                html: `
        <h3>Você foi convidado para o sistema Beuni</h3>
        <p>Para completar seu cadastro, clique no link abaixo:</p>
        <a href="${link}">${link}</a>
        <p>O link expira em 7 dias.</p>
      `
            });

            return res.status(200).json({ message: `Convite enviado para ${email}` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao convidar usuário." });
        }
    }
}