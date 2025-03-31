import { Router } from "express";
import { getMovimientosInventario, getMovimientoInventarioById, postMovimientoInventario, putMovimientoInventario, deleteMovimientoInventario } from "../controllers/movimientos.controller.js";

const router = Router();

router.get("/movimientos", getMovimientosInventario);
router.get("/movimientos/:idmovimiento", getMovimientoInventarioById);
router.post("/movimientos", postMovimientoInventario);
router.put("/movimientos/:idmovimiento", putMovimientoInventario);
router.delete("/movimientos/:idmovimiento", deleteMovimientoInventario);

export default router;
// Compare this snippet from src/controllers/inventariosl.controller.js: