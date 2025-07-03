import { Router } from "express";
import KitController from "../controllers/KitController.js";
import authenticateJWT from "../middlewares/authenticateJWT.js";

const router = Router();

router.use(authenticateJWT);

router.get("/", KitController.getAll);
router.post("/", KitController.create);
router.get("/:id", KitController.findById);
router.put("/:id", KitController.update);
router.delete("/:id", KitController.delete);
router.post("/:kitId/items", KitController.addKitItem);
router.put("/items/:itemId", KitController.updateKitItem);
router.delete("/items/:itemId", KitController.deleteKitItem);

export default router;
