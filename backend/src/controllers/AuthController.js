import bcrypt from "bcryptjs";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/client.js";

export default class AuthController {
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await prisma.usuario.findUnique({
        where: { email },
        include: { organizacao: true }
      });

      if (!usuario) {
        return res.status(401).json({ message: "Email ou senha inválidos." });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaValida) {
        return res.status(401).json({ message: "Email ou senha inválidos." });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          organizacaoId: usuario.organizacaoId
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h"
        }
      );

      return res.status(200).json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          organizacaoId: usuario.organizacaoId
        }
      });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ message: "Erro no login." });
    }
  }

  static async register(req, res) {
    try {
      const { nome, email, senha, organizacaoId } = req.body;

      const userResult = await prisma.usuario.findUnique({
        where: { email }
      });

      if (userResult)
        return res.status(409).json({ message: "Usuário já existe!" });

      const senhaHash = await bcrypt.hash(senha, 10);

      await prisma.usuario.create({
        data: {
          nome,
          email,
          senha_hash: senhaHash,
          organizacaoId
        }
      });

      res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: `${error.message} - Falha ao cadastrar usuário.` });
    }
  }
}