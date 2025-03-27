import { Router } from "express";
import { getProductos, getProducto, postProducto, putProducto, deleteProducto } from "../controllers/productos.controller.js";

const router = Router();

router.get("/productos", getProductos);
router.get("/productos/:idproducto", getProducto);
router.post("/productos", postProducto);
router.put("/productos/:idproducto", putProducto);
router.delete("/productos/:idproducto", deleteProducto);

export default router;