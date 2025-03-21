import { Router } from "express";
import { getMo, getPrecioHById, createPrecioH, updatePrecioH, deletePrecioH } from "../controllers/precioH.controller.js";

const router = Router();

router.get('/preciosH', getPreciosH);
router.get('/preciosH/:id', getPrecioHById);
router.post("/preciosH", createPrecioH);
router.put('/preciosH/:id', updatePrecioH);
router.delete('/preciosH/:id', deletePrecioH);

export default router;