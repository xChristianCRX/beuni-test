import { Router } from "express";
import DepartmentController from "../controllers/DepartmentController.js";
import authenticateJWT from "../middlewares/authenticateJWT.js";

const router = Router();

router.use(authenticateJWT);
router.get("/", DepartmentController.getAll);
router.post("/", DepartmentController.create);
router.put("/:id", DepartmentController.update);
router.delete("/:id", DepartmentController.delete);

export default router;