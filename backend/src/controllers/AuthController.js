import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.js";

export default class UserController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const userResult = await prisma.user.findUnique({
        where: { email },
      });

      if (!userResult || !(await bcrypt.compare(password, userResult.password))) {
        return res.status(401).json({ message: "Login incorreto!" });
      }

      const token = jwt.sign(
        { id: userResult.id, email: userResult.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h", algorithm: "HS256" }
      );

      res.status(200).json({
        message: "Login bem-sucedido",
        token,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - Falha no login.` });
    }
  }

  static async register(req, res) {
    try {
      const { email, password } = req.body;

      const userExists = await prisma.user.findUnique({
        where: { email },
      });

      if (userExists) {
        return res.status(409).json({ message: "Usuário já existe!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - Falha ao cadastrar usuário.` });
    }
  }
}