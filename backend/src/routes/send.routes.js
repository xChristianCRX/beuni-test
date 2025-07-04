import { Router } from "express";
import SendController from "../controllers/SendController.js";
import authenticateJWT from "../middlewares/authenticateJWT.js";

const router = Router();

router.use(authenticateJWT);
router.get("/", SendController.getAll);
router.put("/:id/status", SendController.updateBirthdayStatus);
router.post("/disparar", SendController.triggerSends);

export default router;