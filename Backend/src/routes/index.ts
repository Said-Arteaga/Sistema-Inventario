import { Router } from "express";
import authRoutes from "./authRoutes.js";
import inventarioRoutes from "./inventarioRoutes.js";
import listaComprasRoutes from "./listaComprasRoutes.js";

const masterRouter = Router();

masterRouter.use("/auth", authRoutes);
masterRouter.use("/inventario", inventarioRoutes);
masterRouter.use("/compras", listaComprasRoutes);

export default masterRouter;
