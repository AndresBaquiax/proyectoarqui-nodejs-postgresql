import { Router } from "express";
import { getEmpleados, getEmpleadoById, postEmpleado, putEmpleado, deleteEmpleado } from "../controllers/empleados.controller.js";

const router = Router();

router.get("/empleados", getEmpleados);
router.get("/empleados/:idempleado", getEmpleadoById);
router.post("/empleados", postEmpleado);
router.put("/empleados/:idempleado", putEmpleado);
router.delete("/empleados/:idempleado", deleteEmpleado);

export default router;