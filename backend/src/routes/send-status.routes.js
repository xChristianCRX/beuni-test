import { Router } from "express";
import SendStatusController from "../controllers/SendStatusController";

const router = Router();

router.get("/", SendStatusController.getAll);
router.get("/pending", SendStatusController.getPending);
router.get("/:birthdayId", SendStatusController.getBirthdayStatus);
router.post("/:birthdayId", SendStatusController.setBirthdayStatus);
router.put("/:birthdayId", SendStatusController.updateBirthdayStatus);

export default router;