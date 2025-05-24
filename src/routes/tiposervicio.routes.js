import { Router } from "express";
import { getTipoServicio, getTipoServicioById, postTipoServicio, putTipoServicio, deleteTipoServicio } from "../controllers/tiposervicio.controller.js";

const router = Router();

router.get("/tiposervicios", getTipoServicio);
router.get("/tiposervicios/:idtiposervicio", getTipoServicioById);
router.post("/tiposervicios", postTipoServicio);
router.put("/tiposervicios/:idtiposervicio", putTipoServicio);
router.delete("/tiposervicios/:idtiposervicio", deleteTipoServicio);

export default router;