import { Router } from "express";
import { verificarInventario, configurarIntervalo } from "../controllers/inventoryAlert.controller.js";

const router = Router();

// Rutas simples para control de alertas de inventario
router.post("/inventory-alerts/check", verificarInventario);
router.post("/inventory-alerts/configure", configurarIntervalo);

export default router; 