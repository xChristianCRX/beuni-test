import { Router } from "express";
import OrganizationController from "../controllers/OrganizationController.js";

const router = Router();

router.get("/", OrganizationController.getAll);
router.post("/", OrganizationController.create);
router.get("/:id", OrganizationController.findById);
router.put("/:id", OrganizationController.update);
router.delete("/:id", OrganizationController.delete);

export default router;