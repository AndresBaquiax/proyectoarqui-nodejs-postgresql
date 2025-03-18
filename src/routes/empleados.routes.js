import { Router } from "express";
import { getEmpleados, postEmpleado, putEmpleado, prueba } from "../controllers/empleados.controller.js";

const router = Router();

router.get("/prueba", prueba)
router.get("/empleados", getEmpleados);
router.post("/empleados", postEmpleado);
router.put("/empleados/:idempleado", putEmpleado);

export default router;