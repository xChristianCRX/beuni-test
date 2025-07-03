import { Router } from "express";
import birthdayRoutes from "./birthday.routes.js";
import authRoutes from "./auth.routes.js"
import organizationRoutes from "./organization.routes.js"
import departmentRoutes from "./department.routes.js"
import roleRoutes from "./role.routes.js"
import productRoutes from "./product.routes.js"
import kitRoutes from "./kit.routes.js"
import sendStatusRoutes from "./send-status.routes.js"

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/organizations", organizationRoutes);
routes.use("/departments", departmentRoutes);
routes.use("/roles", roleRoutes);
routes.use("/products", productRoutes);
routes.use("/kits", kitRoutes);
routes.use("/birthdays", birthdayRoutes);
routes.use("/send-status", sendStatusRoutes);

export default routes;
