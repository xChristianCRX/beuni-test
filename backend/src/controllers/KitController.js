import { prisma } from "../../prisma/client.js";

export default class KitController{
    static async getAll(req, res) {
            try {
                const kits = await prisma.kit.findMany({
                    include: {
                        departamento: true,
                        cargo: true,
                        kit: true
                    }
                });
                res.json(kits);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
}