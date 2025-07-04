import { Router } from "express";
import UserController from "../controllers/UserController.js";

const router = Router();

router.get("/", UserController.getAll);
router.post("/convidar", UserController.invite);
router.get("/validar/:token", UserController.validarConvite)
router.post("/registro", UserController.register);
router.put("/:id", UserController.update);

export default router;