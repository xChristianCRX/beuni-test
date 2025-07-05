import { Router } from "express";
import SendController from "../controllers/SendController.js";
import authenticateJWT from "../middlewares/authenticateJWT.js";

const router = Router();

router.use(authenticateJWT);
router.get("/", SendController.getAll);
router.put("/atualizar-status", SendController.updateBirthdayStatus);

export default router;