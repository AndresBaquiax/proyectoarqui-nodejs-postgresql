import { Router } from "express";
import { getServicio, getServicioById, postServicio, putServicio, deleteServicio } from "../controllers/servicio.controller.js";

const router = Router();

router.get("/servicios", getServicio);
router.get("/servicios/:idservicio", getServicioById);
router.post("/servicios", postServicio);
router.put("/servicios/:idservicio", putServicio);
router.delete("/servicios/:idservicio", deleteServicio);

export default router;