import { Router } from "express";
import { getTipoServicio, getTipoServicioById, postTipoServicio, putTipoServicio, deleteTipoServicio } from "../controllers/tiposervicio.controller.js";

const router = Router();

router.get("/tiposervicio", getTipoServicio);
router.get("/tiposervicio/:idtiposervicio", getTipoServicioById);
router.post("/tiposervicio", postTipoServicio);
router.put("/tiposervicio/:idtiposervicio", putTipoServicio);
router.delete("/tiposervicio/:idtiposervicio", deleteTipoServicio);

export default router;