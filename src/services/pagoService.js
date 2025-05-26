import fetch from 'node-fetch';

const PAGO_SERVICE_URL = process.env.PAGO_SERVICE_URL || 'http://137.184.115.238/pagos';

// Mapeo de métodos de pago
export const METODOS_PAGO = {
    EFECTIVO: 1,
    TARJETA_CREDITO: 2,
    TARJETA_DEBITO: 3,
    TRANSACCION: 4,
    FIDELIDAD: 5
};

// Mapeo de servicios de transacción (según su documentación debe ser 1-7)
export const SERVICIOS_TRANSACCION = {
    TALLER_REPUESTOS: 1,
    TALLER_SERVICIOS: 2,
    VENTA_PRODUCTOS: 3,
    MANTENIMIENTO: 4,
    REPARACION: 5,
    DIAGNOSTICO: 6,
    OTROS: 7
};

/**
 * Procesar pago en el sistema externo
 * @param {Object} datosPago - Datos del pago según el formato requerido
 * @returns {Promise<Object>} - Respuesta del sistema de pagos
 */
export const procesarPago = async (datosPago) => {
    try {
        console.log('Enviando datos al sistema de pagos:', JSON.stringify(datosPago, null, 2));
        
        const response = await fetch(`${PAGO_SERVICE_URL}/transacciones/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosPago)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error en el servicio de pagos: ${response.status} ${response.statusText} - ${errorData}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al procesar pago:', error);
        throw new Error(`Error al conectar con el servicio de pagos: ${error.message}`);
    }
};

/**
 * Obtener bancos disponibles
 * NOTA: Este endpoint no está documentado en la API proporcionada
 * @returns {Promise<Array>} - Lista de bancos
 */
export const obtenerBancos = async () => {
    try {
        console.log('Intentando obtener bancos desde:', `${PAGO_SERVICE_URL}/api/bancos`);
        
        const response = await fetch(`${PAGO_SERVICE_URL}/api/bancos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            console.warn(`Endpoint de bancos no disponible: ${response.status} ${response.statusText}`);
            // Retornar datos mock basados en la información proporcionada
            return [
                {
                    "_id": "67f04d9bd89964312a94affe",
                    "nombre": "Industrial",
                    "estado": 1,
                    "totalTransacciones": 0
                },
                {
                    "_id": "67f04e46d89964312a94b000",
                    "nombre": "Bam",
                    "estado": 1,
                    "totalTransacciones": 0
                },
                {
                    "_id": "67f052ae3887ece9996014b8",
                    "nombre": "Banco De Antigua",
                    "estado": 1,
                    "totalTransacciones": 0
                },
                {
                    "_id": "67f03ce6ba585c67b774af4f",
                    "nombre": "Banrural",
                    "estado": 1,
                    "totalTransacciones": 1
                }
            ];
        }

        const data = await response.json();
        return data.Bancos || [];
    } catch (error) {
        console.error('Error al obtener bancos:', error);
        // Retornar datos mock en caso de error
        return [
            {
                "_id": "67f04d9bd89964312a94affe",
                "nombre": "Industrial",
                "estado": 1,
                "totalTransacciones": 0
            },
            {
                "_id": "67f04e46d89964312a94b000",
                "nombre": "Bam",
                "estado": 1,
                "totalTransacciones": 0
            }
        ];
    }
};

/**
 * Obtener cliente por NIT del sistema de pagos
 * @param {string} nit - NIT del cliente
 * @returns {Promise<Object|null>} - Cliente encontrado o null
 */
export const obtenerClientePorNit = async (nit) => {
    try {
        console.log('🔍 Buscando cliente con NIT:', nit);
        console.log('🌐 URL de búsqueda:', `${PAGO_SERVICE_URL}/cliente/obtener/${nit}`);
        
        const response = await fetch(`${PAGO_SERVICE_URL}/cliente/obtener/${nit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('📡 Respuesta del servidor:', response.status, response.statusText);

        if (!response.ok) {
            if (response.status === 500) {
                console.log('❌ Cliente no encontrado (status 500)');
                return null;
            }
            throw new Error(`Error al obtener cliente: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('📦 Datos recibidos del servidor:', JSON.stringify(data, null, 2));
        
        // Según la documentación, la respuesta viene en data.cliente
        const cliente = data.cliente;
        
        if (cliente) {
            console.log('✅ Cliente encontrado:', cliente.nombreCliente, cliente.apellidosCliente);
            return cliente;
        } else {
            console.log('❌ Cliente no encontrado en la respuesta');
            return null;
        }
    } catch (error) {
        console.error('💥 Error al obtener cliente:', error.message);
        
        // Si hay error de conexión, retornar null
        return null;
    }
};

/**
 * Obtener todos los clientes del sistema de pagos
 * @returns {Promise<Array>} - Lista de clientes
 */
export const obtenerTodosLosClientes = async () => {
    try {
        console.log('Obteniendo todos los clientes desde:', `${PAGO_SERVICE_URL}/cliente/obtener`);
        
        const response = await fetch(`${PAGO_SERVICE_URL}/cliente/obtener`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener clientes: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Clientes obtenidos:', data.clientes?.length || 0);
        
        return data.clientes || [];
    } catch (error) {
        console.error('Error al obtener todos los clientes:', error);
        return [];
    }
};

/**
 * Obtener transacción por número
 * @param {string} noTransaccion - Número de transacción
 * @returns {Promise<Object>} - Datos de la transacción
 */
export const obtenerTransaccion = async (noTransaccion) => {
    try {
        const response = await fetch(`${PAGO_SERVICE_URL}/transacciones/obtener/${noTransaccion}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener transacción: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener transacción:', error);
        throw new Error(`Error al obtener transacción: ${error.message}`);
    }
};

/**
 * Anular transacción
 * @param {string} noTransaccion - Número de transacción a anular
 * @returns {Promise<Object>} - Respuesta del sistema
 */
export const anularTransaccion = async (noTransaccion) => {
    try {
        const response = await fetch(`${PAGO_SERVICE_URL}/transacciones/anular/${noTransaccion}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error al anular transacción: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al anular transacción:', error);
        throw new Error(`Error al anular transacción: ${error.message}`);
    }
};

/**
 * Transformar datos de venta a formato de pago
 * @param {Object} venta - Datos de la venta
 * @param {Array} detalleVenta - Detalle de productos/servicios
 * @param {Array} metodosPago - Métodos de pago utilizados
 * @param {string} nitCliente - NIT del cliente
 * @param {number} tipoServicio - Tipo de servicio (1-7)
 * @returns {Object} - Datos formateados para el sistema de pagos
 */
export const transformarDatosVenta = (venta, detalleVenta, metodosPago, nitCliente, tipoServicio = SERVICIOS_TRANSACCION.TALLER_REPUESTOS) => {
    return {
        Nit: nitCliente,
        IdCaja: parseInt(process.env.ID_CAJA) || 1, // Debe ser número
        IdServicioTransaccion: tipoServicio, // Debe ser número del 1 al 7
        Detalle: detalleVenta.map(item => ({
            Producto: item.nombre || item.descripcion,
            Cantidad: parseFloat(item.cantidad),
            Precio: parseFloat(item.precio),
            Descuento: item.descuento ? parseFloat(item.descuento) / 100 : 0 // Convertir porcentaje a decimal
        })),
        MetodosPago: metodosPago.map(metodo => {
            const metodoPago = {
                IdMetodo: parseInt(metodo.idMetodo),
                Monto: parseFloat(metodo.monto)
            };

            // Agregar campos opcionales según el método de pago
            if (metodo.idMetodo === 2 || metodo.idMetodo === 3) { // Tarjeta Crédito o Débito
                if (metodo.noTarjeta) metodoPago.NoTarjeta = metodo.noTarjeta;
                if (metodo.idBanco) metodoPago.IdBanco = metodo.idBanco;
            } else if (metodo.idMetodo === 4) { // Transferencia
                if (metodo.idBanco) metodoPago.IdBanco = metodo.idBanco;
            }

            return metodoPago;
        })
    };
}; 