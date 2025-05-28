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
    anularTransaccionPago,
    procesarVentaConInventario
} from '../controllers/pago.controller.js';
import {
    crearDevolucionController,
    obtenerDevolucionesController,
    obtenerDevolucionController
} from '../controllers/devolucion.controller.js';

const router = express.Router();

// Obtener bancos disponibles del sistema de pagos
router.get('/bancos', getBancos);

// Obtener métodos de pago disponibles
router.get('/metodos-pago', getMetodosPago);

// Obtener servicios de transacción disponibles
router.get('/servicios-transaccion', getServiciosTransaccion);

// Obtener todos los clientes del sistema de pagos
router.get('/clientes-pago', getTodosLosClientes);

// Verificar si un cliente existe en el sistema de pagos
router.get('/verificar-cliente/:nit', verificarClientePago);

// Procesar venta completa con pago
router.post('/procesar-venta-pago', procesarVentaConPago);

// Procesar venta con descuento automático de inventario (sin pago externo)
router.post('/procesar-venta-inventario', procesarVentaConInventario);

// Procesar solo pago para una venta existente
router.post('/procesar-pago/:idVenta', procesarSoloPago);

// Obtener transacción por número
router.get('/transaccion/:noTransaccion', getTransaccion);

// Anular transacción
router.put('/anular-transaccion/:noTransaccion', anularTransaccionPago);

// Rutas de devoluciones del sistema de pagos
router.post('/devoluciones/crear', crearDevolucionController);
router.get('/devoluciones/obtener', obtenerDevolucionesController);
router.get('/devoluciones/obtener/:noDevolucion', obtenerDevolucionController);

export default router; 