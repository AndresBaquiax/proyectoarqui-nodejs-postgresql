import { Router } from "express";
//import { getClientes } from "../controllers/clientes.controller.js"; ->  Example 

const router = Router();

router.get("/clientes", getClientes); // -> Example

export default router;