import { Router } from 'express';
import {
    getVentas,
    getVentaById,
    createVenta,
    updateVenta,
    deleteVenta
} from '../controllers/venta.controller.js';

const router = Router();

router.get('/ventas', getVentas);
router.get('/ventas:id', getVentaById);
router.post('/ventas', createVenta);
router.put('/ventas:id', updateVenta);
router.delete('/ventas:id', deleteVenta);

export default router;
