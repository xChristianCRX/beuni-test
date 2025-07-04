import { Router } from "express";
import BirthdayController from "../controllers/BirthdayController.js";
import authenticateJWT from "../middlewares/authenticateJWT.js";

const router = Router();

router.use(authenticateJWT);
router.get("/", BirthdayController.getAll);
router.post("/", BirthdayController.create);
/* router.put("/:id", BirthdayController.update); */
router.delete("/:id", BirthdayController.delete);

export default router;
