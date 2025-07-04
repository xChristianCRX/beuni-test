import { Router } from "express";
import RoleController from "../controllers/RoleController.js";
import authenticateJWT from "../middlewares/authenticateJWT.js";

const router = Router();

router.use(authenticateJWT);
router.get("/", RoleController.getAll);
router.post("/", RoleController.create);
/* router.put("/:id", RoleController.update);
 */router.delete("/:id", RoleController.delete);

export default router;