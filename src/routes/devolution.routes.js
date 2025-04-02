import { Router } from "express";
import { getDevolucion, getDevolucionById, postDevolucion } from "../controllers/devolucion.controller.js";

const router = Router();

//Routes
router.get("/devolucion", getDevolucion);
router.get("/devolucion/:iddevolucion", getDevolucionById);
router.post("/devolucion", postDevolucion);

export default router;