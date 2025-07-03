import { Router } from "express";
import BirthdayController from "../controllers/BirthdayController.js";
import authenticateJWT from "../middlewares/authenticateJWT.js";

const router = Router();

router.use(authenticateJWT);

router.get("/", BirthdayController.getAll);
router.post("/", BirthdayController.create);
router.get("/:id", BirthdayController.findById);
router.put("/:id", BirthdayController.update);
router.delete("/:id", BirthdayController.delete);
router.get("/month/:month", BirthdayController.filterBirthdaysByMonth);
router.get("/department/:dep", BirthdayController.filterBirthdaysByDepartment);

export default router;
