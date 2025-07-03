import { Router } from "express";
import DepartmentController from "../controllers/DepartmentController.js";

const router = Router();

router.get("/", DepartmentController.getAll);
router.post("/", DepartmentController.create);
router.put("/:id", DepartmentController.update);
router.delete("/:id", DepartmentController.delete);

export default router;