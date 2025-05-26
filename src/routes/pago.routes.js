import express from 'express';
import { 
    getBancos, 
    getMetodosPago,
    getServiciosTransaccion,
    procesarVentaConPago, 
    verificarClientePago,
    getTodosLosClientes,
    procesarSoloPago,
    getTransaccion,
    anularTransaccionPago
} from '../controllers/pago.controller.js';

const router = express.Router();

// Obtener bancos disponibles del sistema de pagos
router.get('/bancos', getBancos);

// Obtener métodos de pago disponibles
router.get('/metodos-pago', getMetodosPago);

// Obtener servicios de transacción disponibles
router.get('/servicios-transaccion', getServiciosTransaccion);

// Obtener todos los clientes del sistema de pagos
router.get('/clientes', getTodosLosClientes);

// Verificar si un cliente existe en el sistema de pagos
router.get('/verificar-cliente/:nit', verificarClientePago);

// Procesar venta completa con pago
router.post('/procesar-venta-pago', procesarVentaConPago);

// Procesar solo pago para una venta existente
router.post('/procesar-pago/:idVenta', procesarSoloPago);

// Obtener transacción por número
router.get('/transaccion/:noTransaccion', getTransaccion);

// Anular transacción
router.put('/anular-transaccion/:noTransaccion', anularTransaccionPago);

export default router; 