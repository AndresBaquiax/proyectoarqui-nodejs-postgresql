import { getConnection, querysProductos } from "../database/index.js";

class AutoDiscountService {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
        this.checkInterval = 24 * 60 * 60 * 1000; // 24 horas
        this.diasParaDescuento = 90;
        this.porcentajeDescuento = 5; // 5%
    }

    /**
     * Verifica y aplica descuentos automáticos cada 24 horas
     */
    async verificarYAplicarDescuentos() {
        try {
            const connection = await getConnection();
            
            // Obtener todos los productos activos
            const productosResult = await connection.query(querysProductos.getProductos);
            const productos = productosResult.rows.filter(producto => producto.status === 1);
            
            connection.release();
            
            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() - this.diasParaDescuento);

            const productosParaDescuento = [];

            // Filtrar productos que cumplan las condiciones
            for (const producto of productos) {
                const fechaCreacion = new Date(producto.created_at);
                
                // Verificar si han pasado 90 días
                if (fechaCreacion <= fechaLimite) {
                    // Verificar si el updated_at es muy similar al created_at (no se ha modificado el precio)
                    const fechaActualizacion = new Date(producto.updated_at);
                    const diferenciaHoras = Math.abs(fechaActualizacion - fechaCreacion) / (1000 * 60 * 60);
                    
                    // Si la diferencia es menor a 1 hora, significa que no se ha actualizado manualmente
                    if (diferenciaHoras < 1) {
                        productosParaDescuento.push(producto);
                    }
                }
            }

            if (productosParaDescuento.length > 0) {
                await this.aplicarDescuentos(productosParaDescuento);
            } else {
                console.log('🔍 No se encontraron productos para aplicar descuento por antigüedad');
            }

        } catch (error) {
            console.error('Error durante verificación de precios:', error);
        }
    }

    /**
     * Aplica descuentos a los productos especificados
     */
    async aplicarDescuentos(productos) {
        let connection = null;
        
        try {
            connection = await getConnection();
            await connection.query('BEGIN');

            let productosActualizados = 0;

            for (const producto of productos) {
                try {
                    const precioActual = parseFloat(producto.precio);
                    const descuento = precioActual * (this.porcentajeDescuento / 100);
                    const nuevoPrecio = precioActual - descuento;

                    // Actualizar el precio del producto
                    await connection.query(querysProductos.putProducto, [
                        producto.nombre,
                        producto.descripcion,
                        nuevoPrecio.toFixed(2),
                        producto.idcategoria,
                        producto.existencia_minima,
                        producto.status,
                        producto.idproducto
                    ]);

                    productosActualizados++;
                    console.log(`💰 Descuento aplicado: "${producto.nombre}" $${precioActual.toFixed(2)} → $${nuevoPrecio.toFixed(2)} (-${this.porcentajeDescuento}%)`);

                } catch (error) {
                    console.error(`Error aplicando descuento a producto ${producto.idproducto}:`, error);
                }
            }

            await connection.query('COMMIT');

            if (productosActualizados > 0) {
                const timestamp = new Date().toLocaleString('es-ES');
                console.log(`\n💰 Descuentos automáticos aplicados - ${timestamp}`);
                console.log(`📦 Total de productos actualizados: ${productosActualizados}`);
                console.log(`💲 Descuento aplicado: ${this.porcentajeDescuento}% por antigüedad de ${this.diasParaDescuento} días\n`);
            }

        } catch (error) {
            if (connection) {
                await connection.query('ROLLBACK');
            }
            console.error('Error aplicando descuentos:', error);
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }

    /**
     * Inicia el monitoreo automático
     */
    iniciar() {
        if (this.isRunning) {
            return;
        }

        console.log(`💰 Descuentos automáticos activados: ${this.porcentajeDescuento}% después de ${this.diasParaDescuento} días (verifica cada 24h)`);
        
        // Verificación inmediata
        this.verificarYAplicarDescuentos();
        
        // Programar verificaciones cada 24 horas
        this.intervalId = setInterval(() => {
            this.verificarYAplicarDescuentos();
        }, this.checkInterval);
        
        this.isRunning = true;
    }
}

// Crear instancia única
const autoDiscountService = new AutoDiscountService();

export default autoDiscountService; 