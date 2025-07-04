import { Router } from "express";
import KitController from "../controllers/KitController.js";
import authenticateJWT from "../middlewares/authenticateJWT.js";


const router = Router();

router.use(authenticateJWT);
router.get("/", KitController.getAll);

export default router;
