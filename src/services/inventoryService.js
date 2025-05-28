import { getConnection, querysInventariosl, querysMovimientoInventario } from "../database/index.js";

class InventoryService {
    
    /**
     * Descuenta productos del inventario basándose en el detalle de una venta
     * @param {Array} detalleVenta - Array con productos vendidos
     * @param {Object} client - Cliente de base de datos (opcional, para transacciones)
     * @returns {Promise<Object>} - Resultado del descuento
     */
    async descontarProductosVenta(detalleVenta, client = null) {
        let connection = client;
        let shouldReleaseConnection = false;
        
        try {
            // Si no se proporciona cliente, crear una nueva conexión
            if (!connection) {
                connection = await getConnection();
                shouldReleaseConnection = true;
                await connection.query('BEGIN');
            }

            const resultados = [];
            const errores = [];

            for (const item of detalleVenta) {
                try {
                    const resultado = await this.descontarProducto(
                        item.idProducto,
                        item.cantidad,
                        item.nombre || `Producto ID: ${item.idProducto}`,
                        connection
                    );
                    resultados.push(resultado);
                } catch (error) {
                    errores.push({
                        idProducto: item.idProducto,
                        nombre: item.nombre,
                        cantidad: item.cantidad,
                        error: error.message
                    });
                }
            }

            // Si hay errores y no estamos en una transacción externa, hacer rollback
            if (errores.length > 0 && !client) {
                await connection.query('ROLLBACK');
                throw new Error(`Error descontando productos: ${JSON.stringify(errores)}`);
            }

            // Si no hay cliente externo, hacer commit
            if (!client) {
                await connection.query('COMMIT');
            }

            return {
                exito: true,
                productosDescontados: resultados,
                errores: errores
            };

        } catch (error) {
            if (!client && connection) {
                await connection.query('ROLLBACK');
            }
            throw error;
        } finally {
            if (shouldReleaseConnection && connection) {
                connection.release();
            }
        }
    }

    /**
     * Descuenta un producto específico del inventario
     * @param {number} idProducto - ID del producto
     * @param {number} cantidadVendida - Cantidad vendida
     * @param {string} descripcionVenta - Descripción para el movimiento
     * @param {Object} connection - Conexión a la base de datos
     * @returns {Promise<Object>} - Resultado del descuento
     */
    async descontarProducto(idProducto, cantidadVendida, descripcionVenta, connection) {
        try {
            // Obtener todos los lotes activos del producto ordenados por fecha (FIFO)
            const inventarioResult = await connection.query(querysInventariosl.getInventariosl);
            const lotesProducto = inventarioResult.rows
                .filter(lote => lote.idproducto === idProducto && lote.activo === true && lote.cantidad > 0)
                .sort((a, b) => new Date(a.fechaadquisicion) - new Date(b.fechaadquisicion));

            if (lotesProducto.length === 0) {
                throw new Error(`No hay stock disponible para el producto ${idProducto}`);
            }

            // Verificar que hay suficiente stock total
            const stockTotal = lotesProducto.reduce((total, lote) => total + parseInt(lote.cantidad), 0);
            if (stockTotal < cantidadVendida) {
                throw new Error(`Stock insuficiente para producto ${idProducto}. Disponible: ${stockTotal}, Requerido: ${cantidadVendida}`);
            }

            let cantidadRestante = parseInt(cantidadVendida);
            const movimientos = [];

            // Descontar de los lotes usando FIFO (First In, First Out)
            for (const lote of lotesProducto) {
                if (cantidadRestante <= 0) break;

                const cantidadLote = parseInt(lote.cantidad);
                const cantidadADescontar = Math.min(cantidadLote, cantidadRestante);

                // Actualizar la cantidad del lote
                const nuevaCantidad = cantidadLote - cantidadADescontar;
                
                await connection.query(querysInventariosl.putInventariol, [
                    lote.idproducto,
                    nuevaCantidad,
                    lote.fechaadquisicion,
                    nuevaCantidad > 0, // Si queda stock, mantener activo; si no, desactivar
                    lote.idlote
                ]);

                // Registrar el movimiento de salida
                await connection.query(querysMovimientoInventario.postMovimientoInventario, [
                    lote.idlote,
                    idProducto,
                    cantidadADescontar,
                    'salida',
                    `Venta: ${descripcionVenta}`
                ]);

                movimientos.push({
                    idLote: lote.idlote,
                    cantidadDescontada: cantidadADescontar,
                    cantidadRestanteLote: nuevaCantidad
                });

                cantidadRestante -= cantidadADescontar;
                
                console.log(`📦 Descontado del lote ${lote.idlote}: ${cantidadADescontar} unidades. Restante en lote: ${nuevaCantidad}`);
            }

            return {
                idProducto: idProducto,
                cantidadVendida: cantidadVendida,
                movimientos: movimientos,
                mensaje: `Producto ${idProducto} descontado exitosamente`
            };

        } catch (error) {
            console.error(`Error descontando producto ${idProducto}:`, error);
            throw error;
        }
    }

    /**
     * Verifica si hay suficiente stock para una venta antes de procesarla
     * @param {Array} detalleVenta - Detalle de productos a vender
     * @returns {Promise<Object>} - Resultado de la verificación
     */
    async verificarStockDisponible(detalleVenta) {
        try {
            const connection = await getConnection();
            const inventarioResult = await connection.query(querysInventariosl.getInventariosl);
            const lotes = inventarioResult.rows.filter(lote => lote.activo === true);
            connection.release();

            const verificaciones = [];
            const errores = [];

            for (const item of detalleVenta) {
                const lotesProducto = lotes.filter(lote => lote.idproducto === item.idProducto);
                const stockTotal = lotesProducto.reduce((total, lote) => total + parseInt(lote.cantidad), 0);
                
                const verificacion = {
                    idProducto: item.idProducto,
                    nombre: item.nombre,
                    cantidadRequerida: item.cantidad,
                    stockDisponible: stockTotal,
                    suficienteStock: stockTotal >= item.cantidad
                };

                verificaciones.push(verificacion);

                if (!verificacion.suficienteStock) {
                    errores.push(`Producto ${item.nombre} (ID: ${item.idProducto}): Stock insuficiente. Disponible: ${stockTotal}, Requerido: ${item.cantidad}`);
                }
            }

            return {
                verificaciones: verificaciones,
                stockSuficiente: errores.length === 0,
                errores: errores
            };

        } catch (error) {
            console.error('Error verificando stock:', error);
            throw error;
        }
    }
}

// Crear instancia única del servicio
const inventoryService = new InventoryService();

export default inventoryService; 