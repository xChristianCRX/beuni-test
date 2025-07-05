import { Router } from "express";
import birthdayRoutes from "./birthday.routes.js";
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js"
import departmentRoutes from "./department.routes.js"
import kitRoutes from "./kit.routes.js"
import sendRoutes from "./send.routes.js"

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/usuarios", userRoutes);
routes.use("/departamentos", departmentRoutes);
routes.use("/kits", kitRoutes);
routes.use("/aniversariantes", birthdayRoutes);
routes.use("/envios", sendRoutes);

export default routes;
