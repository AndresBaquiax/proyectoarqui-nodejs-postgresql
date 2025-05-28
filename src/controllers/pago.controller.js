import { pool } from '../database/connection.js';
import { querysVentas } from '../database/querys.js';
import inventoryService from '../services/inventoryService.js';
import { 
    procesarPago, 
    obtenerBancos, 
    obtenerClientePorNit,
    obtenerTodosLosClientes,
    obtenerTransaccion,
    anularTransaccion,
    transformarDatosVenta,
    METODOS_PAGO,
    SERVICIOS_TRANSACCION 
} from '../services/pagoService.js';

// --------------------- GET BANCOS ---------------------
export const getBancos = async (req, res) => {
    try {
        const bancos = await obtenerBancos();
        res.status(200).json({ bancos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --------------------- GET MÉTODOS DE PAGO ---------------------
export const getMetodosPago = async (req, res) => {
    try {
        const metodos = Object.entries(METODOS_PAGO).map(([nombre, id]) => ({
            id,
            nombre: nombre.replace('_', ' ').toLowerCase()
        }));
        res.status(200).json({ metodosPago: metodos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --------------------- GET SERVICIOS DE TRANSACCIÓN ---------------------
export const getServiciosTransaccion = async (req, res) => {
    try {
        const servicios = Object.entries(SERVICIOS_TRANSACCION).map(([nombre, id]) => ({
            id,
            nombre: nombre.replace('_', ' ').toLowerCase()
        }));
        res.status(200).json({ serviciosTransaccion: servicios });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --------------------- PROCESAR VENTA CON PAGO ---------------------
export const procesarVentaConPago = async (req, res) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const { 
            venta, 
            detalleVenta, 
            metodosPago, 
            nitCliente,
            tipoServicio = SERVICIOS_TRANSACCION.TALLER_REPUESTOS
        } = req.body;

        // Validaciones básicas
        if (!venta || !detalleVenta || !metodosPago || !nitCliente) {
            return res.status(400).json({ 
                error: "Faltan datos requeridos: venta, detalleVenta, metodosPago, nitCliente" 
            });
        }

        // Validar tipo de servicio
        if (tipoServicio < 1 || tipoServicio > 7) {
            return res.status(400).json({ 
                error: "tipoServicio debe ser un número entre 1 y 7" 
            });
        }

        // Validar que el detalle incluya IDs de productos para descuento de inventario
        const productosParaDescuento = detalleVenta.filter(item => item.idProducto);
        if (productosParaDescuento.length > 0) {
            // Verificar stock disponible antes de procesar la venta
            const verificacionStock = await inventoryService.verificarStockDisponible(productosParaDescuento);
            if (!verificacionStock.stockSuficiente) {
                return res.status(400).json({
                    error: "Stock insuficiente para algunos productos",
                    detalles: verificacionStock.errores
                });
            }
        }

        // Verificar que el cliente existe en el sistema de pagos
        const clientePagos = await obtenerClientePorNit(nitCliente);
        if (!clientePagos) {
            return res.status(404).json({ 
                error: `Cliente con NIT ${nitCliente} no encontrado en el sistema de pagos` 
            });
        }

        // Crear la venta en tu sistema
        const resultVenta = await client.query(querysVentas.createVenta, [
            venta.tipoventa,
            venta.fechaventa || new Date().toISOString(),
            venta.totalventa,
            venta.idcliente,
            venta.status || 1
        ]);

        const ventaCreada = resultVenta.rows[0];

        // Transformar datos para el sistema de pagos
        const datosPago = transformarDatosVenta(
            ventaCreada, 
            detalleVenta, 
            metodosPago, 
            nitCliente,
            tipoServicio
        );

        // Procesar pago en el sistema externo
        const resultadoPago = await procesarPago(datosPago);

        // Si el pago fue exitoso, descontar productos del inventario
        let resultadoInventario = null;
        if (productosParaDescuento.length > 0) {
            try {
                resultadoInventario = await inventoryService.descontarProductosVenta(productosParaDescuento, client);
                console.log(`✅ Inventario actualizado para venta ${ventaCreada.id || ventaCreada.idventa}:`, resultadoInventario.productosDescontados.length, 'productos descontados');
            } catch (error) {
                console.error('Error descontando inventario:', error);
                // Si falla el descuento de inventario, hacer rollback de toda la transacción
                await client.query('ROLLBACK');
                return res.status(500).json({
                    error: "Error actualizando inventario después del pago",
                    detalles: error.message
                });
            }
        }

        // Si todo fue exitoso, confirmar la transacción
        await client.query('COMMIT');

        const respuesta = {
            message: "Venta y pago procesados exitosamente",
            venta: ventaCreada,
            pago: resultadoPago
        };

        // Incluir información de inventario si se descontaron productos
        if (resultadoInventario) {
            respuesta.inventario = {
                productosDescontados: resultadoInventario.productosDescontados.length,
                detalles: resultadoInventario.productosDescontados
            };
        }

        res.status(201).json(respuesta);

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al procesar venta con pago:', error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

// --------------------- VERIFICAR CLIENTE EN SISTEMA DE PAGOS ---------------------
export const verificarClientePago = async (req, res) => {
    try {
        const { nit } = req.params;
        
        if (!nit) {
            return res.status(400).json({ error: "NIT es requerido" });
        }

        const cliente = await obtenerClientePorNit(nit);
        
        if (!cliente) {
            return res.status(404).json({ 
                message: "Cliente no encontrado en el sistema de pagos",
                encontrado: false 
            });
        }

        res.status(200).json({
            message: "Cliente encontrado en el sistema de pagos",
            encontrado: true,
            cliente: {
                id: cliente._id,
                nombre: `${cliente.nombreCliente} ${cliente.apellidosCliente}`,
                nit: cliente.nit,
                email: cliente.email,
                telefono: cliente.telefono,
                tarjetasFidelidad: cliente.tarjetaFidelidad?.filter(t => t.estado === 1) || []
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --------------------- PROCESAR SOLO PAGO (para ventas existentes) ---------------------
export const procesarSoloPago = async (req, res) => {
    try {
        const { idVenta } = req.params;
        const { 
            detalleVenta, 
            metodosPago, 
            nitCliente,
            tipoServicio = SERVICIOS_TRANSACCION.TALLER_REPUESTOS
        } = req.body;

        // Obtener la venta existente
        const resultVenta = await pool.query(querysVentas.getVentaById, [idVenta]);
        
        if (resultVenta.rows.length === 0) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }

        const venta = resultVenta.rows[0];

        // Verificar cliente en sistema de pagos
        const clientePagos = await obtenerClientePorNit(nitCliente);
        if (!clientePagos) {
            return res.status(404).json({ 
                error: `Cliente con NIT ${nitCliente} no encontrado en el sistema de pagos` 
            });
        }

        // Transformar y procesar pago
        const datosPago = transformarDatosVenta(venta, detalleVenta, metodosPago, nitCliente, tipoServicio);
        const resultadoPago = await procesarPago(datosPago);

        res.status(200).json({
            message: "Pago procesado exitosamente",
            venta: venta,
            pago: resultadoPago
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --------------------- OBTENER TRANSACCIÓN ---------------------
export const getTransaccion = async (req, res) => {
    try {
        const { noTransaccion } = req.params;
        
        if (!noTransaccion) {
            return res.status(400).json({ error: "Número de transacción es requerido" });
        }

        const transaccion = await obtenerTransaccion(noTransaccion);
        res.status(200).json(transaccion);

    } catch (error) {
        if (error.message.includes('404')) {
            res.status(404).json({ error: "Transacción no encontrada" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

// --------------------- ANULAR TRANSACCIÓN ---------------------
export const anularTransaccionPago = async (req, res) => {
    try {
        const { noTransaccion } = req.params;
        
        if (!noTransaccion) {
            return res.status(400).json({ error: "Número de transacción es requerido" });
        }

        const resultado = await anularTransaccion(noTransaccion);
        res.status(200).json({
            message: "Transacción anulada exitosamente",
            resultado
        });

    } catch (error) {
        if (error.message.includes('404')) {
            res.status(404).json({ error: "Transacción no encontrada" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

// --------------------- GET TODOS LOS CLIENTES ---------------------
export const getTodosLosClientes = async (req, res) => {
    try {
        const clientes = await obtenerTodosLosClientes();
        res.status(200).json({ clientes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --------------------- PROCESAR VENTA CON DESCUENTO DE INVENTARIO (SIN PAGO EXTERNO) ---------------------
export const procesarVentaConInventario = async (req, res) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const { 
            venta, 
            detalleVenta
        } = req.body;

        // Validaciones básicas
        if (!venta || !detalleVenta) {
            return res.status(400).json({ 
                error: "Faltan datos requeridos: venta, detalleVenta" 
            });
        }

        // Validar que el detalle incluya IDs de productos para descuento de inventario
        const productosParaDescuento = detalleVenta.filter(item => item.idProducto);
        if (productosParaDescuento.length === 0) {
            return res.status(400).json({
                error: "Debe incluir al menos un producto con idProducto para descontar del inventario"
            });
        }

        // Verificar stock disponible antes de procesar la venta
        const verificacionStock = await inventoryService.verificarStockDisponible(productosParaDescuento);
        if (!verificacionStock.stockSuficiente) {
            return res.status(400).json({
                error: "Stock insuficiente para algunos productos",
                detalles: verificacionStock.errores
            });
        }

        // Crear la venta en el sistema
        const resultVenta = await client.query(querysVentas.createVenta, [
            venta.tipoventa,
            venta.fechaventa || new Date().toISOString(),
            venta.totalventa,
            venta.idcliente,
            venta.status || 1
        ]);

        const ventaCreada = resultVenta.rows[0];

        // Descontar productos del inventario
        const resultadoInventario = await inventoryService.descontarProductosVenta(productosParaDescuento, client);
        
        console.log(`✅ Venta ${ventaCreada.id || ventaCreada.idventa} procesada con descuento de inventario:`, resultadoInventario.productosDescontados.length, 'productos descontados');

        // Confirmar la transacción
        await client.query('COMMIT');

        res.status(201).json({
            message: "Venta procesada e inventario actualizado exitosamente",
            venta: ventaCreada,
            inventario: {
                productosDescontados: resultadoInventario.productosDescontados.length,
                detalles: resultadoInventario.productosDescontados
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al procesar venta con inventario:', error);
        res.status(500).json({ 
            error: "Error procesando la venta",
            detalles: error.message 
        });
    } finally {
        client.release();
    }
}; 