import { prisma } from "../../prisma/client.js";

export default class RoleController{
    static async getAll(req, res) {
    try {
      const roles = await prisma.role.findMany({
        include: { department: true, organization: true }
      });
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { name, organizationId, departmentId } = req.body;
      const role = await prisma.role.create({
        data: {
          name,
          organizationId: Number(organizationId),
          departmentId: departmentId ? Number(departmentId) : null
        }
      });
      res.status(201).json(role);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await prisma.role.delete({
        where: { id: Number(id) }
      });
      res.json({ message: "Cargo removido com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}