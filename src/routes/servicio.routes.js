import { Router } from "express";
import { getServicio, getServicioById, postServicio, putServicio, deleteServicio } from "../controllers/servicio.controller.js";

const router = Router();

router.get("/servicio", getServicio);
router.get("/servicio/:idservicio", getServicioById);
router.post("/servicio", postServicio);
router.put("/servicio/:idservicio", putServicio);
router.delete("/servicio/:idservicio", deleteServicio);

export default router;