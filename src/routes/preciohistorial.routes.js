import { Router } from "express";
import { getPrecioHistorial, getPrecioHistorialById, postPrecioHistorial, putPrecioHistorial, deletePrecioHistorial } from "../controllers/preciohistorial.controller.js";

const router = Router();

//Routes
router.get("/preciohistorial", getPrecioHistorial);
router.get("/preciohistorial/:idhistorial", getPrecioHistorialById);
router.post("/preciohistorial", postPrecioHistorial);
router.put("/preciohistorial/:idhistorial", putPrecioHistorial);
router.delete("/preciohistorial/:idhistorial", deletePrecioHistorial);

export default router;