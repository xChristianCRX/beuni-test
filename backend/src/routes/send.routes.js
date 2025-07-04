import { Router } from "express";
import SendStatusController from "../controllers/SendStatusController.js";

const router = Router();

router.get("/", SendStatusController.getAll);
router.put("/:id/status", SendStatusController.updateBirthdayStatus);
router.post("/disparar", SendStatusController.triggerSends);

export default router;