# Integración con Sistema de Pagos

Este documento describe la integración entre el sistema de taller de repuestos y el sistema de pagos externo.

## Configuración

### Variables de Entorno

Agregar las siguientes variables a tu archivo `.env`:

```env
# CONFIGURACIÓN DEL SISTEMA DE PAGOS
PAGO_SERVICE_URL=http://localhost:3001
ID_CAJA=1
```

### Instalación de Dependencias

```bash
npm install node-fetch@3.3.2
```

## Endpoints Disponibles

### 1. Obtener Bancos
```
GET /tallerrepuestos/bancos
```
Retorna la lista de bancos disponibles del sistema de pagos.

### 2. Obtener Métodos de Pago
```
GET /tallerrepuestos/metodos-pago
```
Retorna los métodos de pago disponibles:
- 1: Efectivo
- 2: Tarjeta Crédito
- 3: Tarjeta Débito
- 4: Transferencia
- 5: Fidelidad

### 3. Obtener Servicios de Transacción
```
GET /tallerrepuestos/servicios-transaccion
```
Retorna los tipos de servicio disponibles:
- 1: Taller Repuestos
- 2: Taller Servicios
- 3: Venta Productos
- 4: Mantenimiento
- 5: Reparación
- 6: Diagnóstico
- 7: Otros

### 4. Verificar Cliente
```
GET /tallerrepuestos/verificar-cliente/{nit}
```
Verifica si un cliente existe en el sistema de pagos usando su NIT.

### 5. Procesar Venta Completa con Pago
```
POST /tallerrepuestos/procesar-venta-pago
```

Crea una venta en el sistema local y procesa el pago en el sistema externo de forma transaccional.

**Ejemplo de payload:**
```json
{
    "venta": {
        "tipoventa": "Repuestos",
        "totalventa": 150.00,
        "idcliente": 5,
        "status": 1
    },
    "detalleVenta": [
        {
            "nombre": "Filtro de aceite",
            "cantidad": 2,
            "precio": 25.00,
            "descuento": 10
        },
        {
            "nombre": "Bujías",
            "cantidad": 4,
            "precio": 25.00,
            "descuento": 0
        }
    ],
    "metodosPago": [
        {
            "idMetodo": 1,
            "monto": 150.00
        }
    ],
    "nitCliente": "1234567-8",
    "tipoServicio": 1
}
```

### 6. Procesar Pago para Venta Existente
```
POST /tallerrepuestos/procesar-pago/{idVenta}
```

Procesa el pago en el sistema externo para una venta ya existente.

### 7. Obtener Transacción
```
GET /tallerrepuestos/transaccion/{noTransaccion}
```

Obtiene los detalles de una transacción específica.

### 8. Anular Transacción
```
PUT /tallerrepuestos/anular-transaccion/{noTransaccion}
```

Anula una transacción existente en el sistema de pagos.

## Ejemplo Práctico: Realizar una Venta

### Paso 1: Verificar Cliente
```bash
GET /tallerrepuestos/verificar-cliente/1234567-8
```

**Respuesta exitosa:**
```json
{
    "message": "Cliente encontrado en el sistema de pagos",
    "encontrado": true,
    "cliente": {
        "id": "67e0bf2b1dae516ec25efe4a",
        "nombre": "Eduardo Merida",
        "nit": "1234567-8",
        "email": "acabal@gmail.com",
        "telefono": "88888",
        "tarjetasFidelidad": [
            {
                "noTarjeta": "FID-1234567890101-5",
                "cantidadPuntos": 0,
                "fechaExpiracion": "2027-04-01T17:27:33.890Z"
            }
        ]
    }
}
```

### Paso 2: Obtener Bancos (si se necesita para tarjetas)
```bash
GET /tallerrepuestos/bancos
```

### Paso 3: Procesar Venta con Pago
```bash
POST /tallerrepuestos/procesar-venta-pago
Content-Type: application/json

{
    "venta": {
        "tipoventa": "Repuestos y Servicios",
        "totalventa": 275.50,
        "idcliente": 5,
        "status": 1
    },
    "detalleVenta": [
        {
            "nombre": "Cambio de aceite",
            "cantidad": 1,
            "precio": 150.00,
            "descuento": 0
        },
        {
            "nombre": "Filtro de aceite",
            "cantidad": 1,
            "precio": 45.50,
            "descuento": 0
        },
        {
            "nombre": "Bujías NGK",
            "cantidad": 4,
            "precio": 20.00,
            "descuento": 10
        }
    ],
    "metodosPago": [
        {
            "idMetodo": 1,
            "monto": 200.00
        },
        {
            "idMetodo": 2,
            "monto": 75.50,
            "noTarjeta": "4532-****-****-1234",
            "idBanco": "67f04d9bd89964312a94affe"
        }
    ],
    "nitCliente": "1234567-8",
    "tipoServicio": 2
}
```

**Respuesta exitosa:**
```json
{
    "message": "Venta y pago procesados exitosamente",
    "venta": {
        "id": 15,
        "tipoventa": "Repuestos y Servicios",
        "fechaventa": "2025-01-15T20:30:00.000Z",
        "totalventa": 275.50,
        "idcliente": 5,
        "status": 1
    },
    "pago": {
        "mensaje": "Transacción realizada correctamente",
        "idTransaccion": "67f12345d89964312a94b123",
        "noTransaccion": 1001,
        "noAutorizacion": "AUTH-2025-001",
        "factura": {
            "noFactura": "FACT-00015",
            "total": 275.50,
            "estado": 1,
            "fecha": "2025-01-15T20:30:00.000Z"
        }
    }
}
```

## Formato de Datos Enviado al Sistema de Pagos

El sistema transforma automáticamente los datos al formato requerido:

```json
{
    "Nit": "1234567-8",
    "IdCaja": 1,
    "IdServicioTransaccion": 2,
    "Detalle": [
        {
            "Producto": "Cambio de aceite",
            "Cantidad": 1,
            "Precio": 150.00,
            "Descuento": 0
        },
        {
            "Producto": "Filtro de aceite",
            "Cantidad": 1,
            "Precio": 45.50,
            "Descuento": 0
        },
        {
            "Producto": "Bujías NGK",
            "Cantidad": 4,
            "Precio": 20.00,
            "Descuento": 0.1
        }
    ],
    "MetodosPago": [
        {
            "IdMetodo": 1,
            "Monto": 200.00
        },
        {
            "IdMetodo": 2,
            "Monto": 75.50,
            "NoTarjeta": "4532-****-****-1234",
            "IdBanco": "67f04d9bd89964312a94affe"
        }
    ]
}
```

## Consideraciones Importantes

### Descuentos
- Los descuentos se envían como decimales (10% = 0.1)
- Se calculan automáticamente desde porcentajes

### Métodos de Pago
- **Efectivo (1)**: Solo requiere `IdMetodo` y `Monto`
- **Tarjeta Crédito/Débito (2/3)**: Requiere `NoTarjeta` e `IdBanco`
- **Transferencia (4)**: Requiere `IdBanco`
- **Fidelidad (5)**: Requiere `NoTarjeta` (número de tarjeta de fidelidad)

### Tipos de Servicio
- Usar el tipo apropiado según el contexto de la venta
- Por defecto se usa `1` (Taller Repuestos)

## Manejo de Errores

- **400**: Datos faltantes o inválidos
- **404**: Cliente no encontrado en sistema de pagos o venta no encontrada
- **500**: Error de conexión con sistema de pagos o error interno

## Para Docker

En `docker-compose.yml`, asegúrate de que los servicios puedan comunicarse:

```yaml
services:
  taller-api:
    environment:
      - PAGO_SERVICE_URL=http://pagos-api:3001
      - ID_CAJA=1
  
  pagos-api:
    ports:
      - "3001:3001"
```

## Próximos Pasos

1. ✅ **Documentación actualizada** según API real
2. **Configurar variables de entorno** en tu archivo `.env`
3. **Probar endpoints** con datos reales
4. **Implementar logging** para auditoría
5. **Agregar validaciones** adicionales según reglas de negocio 