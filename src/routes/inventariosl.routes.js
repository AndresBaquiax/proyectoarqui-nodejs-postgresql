import { Router } from "express";
import { getInventariosl, getInventarioslById, postInventariol, putInventariol, deleteInventariol} from "../controllers/inventariosl.controller.js";

const router = Router();

router.get("/inventariosl", getInventariosl);
router.get("/inventariosl/:idlote", getInventarioslById);
router.post("/inventariosl", postInventariol);
router.put("/inventariosl/:idlote", putInventariol);
router.delete("/inventariosl/:idlote", deleteInventariol);


export default router;  