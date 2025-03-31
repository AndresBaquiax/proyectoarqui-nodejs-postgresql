import { Router } from "express";
import { getCategorias, getCategoria, postCategoria, putCategoria, deleteCategoria } from "../controllers/categorias.controller.js";

const router = Router();

router.get("/categorias", getCategorias);
router.get("/categorias/:idcategoria", getCategoria);
router.post("/categorias", postCategoria);
router.put("/categorias/:idcategoria", putCategoria);
router.delete("/categorias/:idcategoria", deleteCategoria);

export default router;