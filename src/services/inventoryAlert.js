import { getConnection, querysProductos, querysInventariosl } from "../database/index.js";

class InventoryAlertService {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
        this.checkInterval = 30 * 60 * 1000; // 30 minutos por defecto
    }

    /**
     * Verifica el inventario y muestra alertas en consola
     */
    async verificarYAlertar() {
        try {
            const connection = await getConnection();
            
            // Obtener todos los lotes de inventario activos
            const inventarioResult = await connection.query(querysInventariosl.getInventariosl);
            const lotes = inventarioResult.rows.filter(lote => lote.activo === true);
            
            // Obtener todos los productos
            const productosResult = await connection.query(querysProductos.getProductos);
            const productos = productosResult.rows.filter(producto => producto.status === 1);
            
            connection.release();
            
            const alertas = [];

            // Verificar cada lote activo
            for (const lote of lotes) {
                // Buscar el producto correspondiente
                const producto = productos.find(p => p.idproducto === lote.idproducto);
                
                if (producto) {
                    const cantidadLote = parseInt(lote.cantidad) || 0;
                    const existenciaMinima = parseInt(producto.existencia_minima) || 10;
                    
                    // Si la cantidad del lote es menor o igual a la existencia mínima
                    if (cantidadLote <= existenciaMinima) {
                        const esStockCero = cantidadLote === 0;
                        
                        alertas.push({
                            idLote: lote.idlote,
                            idProducto: producto.idproducto,
                            nombreProducto: producto.nombre,
                            cantidadActual: cantidadLote,
                            existenciaMinima: existenciaMinima,
                            critico: esStockCero
                        });
                    }
                }
            }

            // Mostrar alertas en consola o mensaje de todo bien
            if (alertas.length > 0) {
                this.mostrarAlertasConsola(alertas);
            } else {
                this.mostrarMensajeTodoBien();
            }

        } catch (error) {
            console.error('Error durante verificación de inventario:', error);
        }
    }

    /**
     * Muestra mensaje cuando todos los productos están bien
     */
    mostrarMensajeTodoBien() {
        const timestamp = new Date().toLocaleString('es-ES');
        const separador = '═'.repeat(80);
        
        console.log('\n' + separador);
        console.log('✅ VERIFICACIÓN DE INVENTARIO - ' + timestamp);
        console.log(separador);
        console.log('🎉 Todos los productos están arriba del stock mínimo');
        console.log('📊 No se requiere reabastecimiento en este momento');
        console.log(separador + '\n');
    }

    /**
     * Muestra las alertas en consola con formato
     */
    mostrarAlertasConsola(alertas) {
        const timestamp = new Date().toLocaleString('es-ES');
        const separador = '═'.repeat(80);
        
        console.log('\n' + separador);
        console.log('🚨 ALERTA DE INVENTARIO - ' + timestamp);
        console.log(separador);
        
        alertas.forEach(alerta => {
            if (alerta.critico) {
                console.log(`🔴 SIN STOCK: "${alerta.nombreProducto}" (Producto ID: ${alerta.idProducto}, Lote ID: ${alerta.idLote})`);
                console.log(`   ⚠️  No hay existencias disponibles - REABASTECIMIENTO URGENTE`);
            } else {
                console.log(`🟡 STOCK BAJO: "${alerta.nombreProducto}" (Producto ID: ${alerta.idProducto}, Lote ID: ${alerta.idLote})`);
                console.log(`   📊 Cantidad actual: ${alerta.cantidadActual} | Mínimo requerido: ${alerta.existenciaMinima}`);
            }
            console.log('');
        });
        
        console.log(`Total de lotes con alerta: ${alertas.length}`);
        console.log(separador + '\n');
    }

    /**
     * Inicia el monitoreo automático
     */
    iniciar(intervaloMinutos = 30) {
        if (this.isRunning) {
            console.log('⚠️  El monitoreo ya está activo');
            return;
        }

        this.checkInterval = intervaloMinutos * 60 * 1000;
        console.log(`🚀 Iniciando monitoreo automático de inventario cada ${intervaloMinutos} minutos`);
        
        // Verificación inmediata
        this.verificarYAlertar();
        
        // Programar verificaciones periódicas
        this.intervalId = setInterval(() => {
            this.verificarYAlertar();
        }, this.checkInterval);
        
        this.isRunning = true;
    }

    /**
     * Detiene el monitoreo automático
     */
    detener() {
        if (!this.isRunning) {
            console.log('⚠️  El monitoreo no está activo');
            return;
        }

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        this.isRunning = false;
        console.log('🛑 Monitoreo de inventario detenido');
    }
}

// Crear instancia única
const inventoryAlert = new InventoryAlertService();

export default inventoryAlert; 