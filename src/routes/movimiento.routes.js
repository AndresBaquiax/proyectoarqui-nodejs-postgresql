import { Router } from "express";
import { getMovimientos, getMovimientoById, createMovimiento, updateMovimiento, deleteMovimiento } from "../controllers/movimiento.controller.js";

const router = Router();

router.get('/Movimientos', getMovimientos);
router.get('/Movimientos/:id', getMovimientoById);
router.post("/Movimientos", createMovimiento);
router.put('/Movimientos/:id', updateMovimiento);
router.delete('/Movimientos/:id', deleteMovimiento);

export default router;