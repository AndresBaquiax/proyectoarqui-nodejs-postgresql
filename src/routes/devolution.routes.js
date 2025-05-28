import { Router } from "express";
import { 
    getDevolucion, 
    getDevolucionById, 
    postDevolucion,
    crearDevolucionController,
    obtenerDevolucionesController,
    obtenerDevolucionController
} from "../controllers/devolucion.controller.js";

const router = Router();

// Rutas originales del sistema local
router.get("/devolucion", getDevolucion);
router.get("/devolucion/:iddevolucion", getDevolucionById);
router.post("/devolucion", postDevolucion);

// Rutas nuevas para el sistema de pagos (según documentación API)
router.post("/devoluciones/crear", crearDevolucionController);
router.get("/devoluciones/obtener", obtenerDevolucionesController);
router.get("/devoluciones/obtener/:noDevolucion", obtenerDevolucionController);

export default router;