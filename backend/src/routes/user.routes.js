import { Router } from "express";
import UserController from "../controllers/UserController.js";
import authenticateJWT from "../middlewares/authenticateJWT.js";

const router = Router();

router.use(authenticateJWT);
router.get("/", UserController.getAll);
router.post("/convidar", UserController.convidar);
router.post("/registro", UserController.registrar);
router.put("/:id", UserController.update);

export default router;