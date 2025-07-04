import bcrypt from "bcryptjs";
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
}