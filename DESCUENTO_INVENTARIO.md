# Sistema de Descuento Automático de Inventario

## 📋 Descripción

El sistema ahora incluye funcionalidad para descontar automáticamente productos del inventario cuando se realizan ventas. Esta característica:

- ✅ Verifica stock disponible antes de procesar la venta
- ✅ Descuenta productos usando el método FIFO (First In, First Out)
- ✅ Registra movimientos de inventario automáticamente
- ✅ Mantiene integridad transaccional
- ✅ Funciona tanto con el sistema de pagos como independientemente

## 🚀 Nuevas Funcionalidades

### 1. Descuento Automático en Ventas con Pago
**Endpoint:** `POST /tallerrepuestos/procesar-venta-pago`

Ahora cuando procesas una venta con pago, si incluyes `idProducto` en el `detalleVenta`, el sistema automáticamente:
- Verifica que hay stock suficiente
- Descuenta los productos del inventario
- Registra los movimientos

### 2. Nuevo Endpoint: Venta Solo con Inventario
**Endpoint:** `POST /tallerrepuestos/procesar-venta-inventario`

Para ventas que no requieren integración con el sistema de pagos externo.

## 📊 Formato de Datos

### Estructura Requerida

```json
{
  "venta": {
    "tipoventa": "Repuestos",
    "totalventa": 120.00,
    "idcliente": 5
  },
  "detalleVenta": [
    {
      "idProducto": 10,        // ⚠️ REQUERIDO para descuento
      "nombre": "Filtro aceite",
      "cantidad": 2,
      "precio": 25.00
    },
    {
      "idProducto": 15,        // ⚠️ REQUERIDO para descuento
      "nombre": "Bujías NGK", 
      "cantidad": 4,
      "precio": 17.50
    }
  ]
}
```

### Respuesta del Sistema

```json
{
  "message": "Venta procesada e inventario actualizado exitosamente",
  "venta": {
    "id": 15,
    "tipoventa": "Repuestos",
    "fechaventa": "2025-01-15T14:30:00.000Z",
    "totalventa": 120.00,
    "idcliente": 5,
    "status": 1
  },
  "inventario": {
    "productosDescontados": 2,
    "detalles": [
      {
        "idProducto": 10,
        "cantidadVendida": 2,
        "movimientos": [
          {
            "idLote": 25,
            "cantidadDescontada": 2,
            "cantidadRestanteLote": 8
          }
        ],
        "mensaje": "Producto 10 descontado exitosamente"
      }
    ]
  }
}
```

## 🛠️ Lógica de Descuento

### Método FIFO (First In, First Out)
El sistema descuenta productos siguiendo el método FIFO:

1. **Ordenamiento:** Los lotes se ordenan por `fechaadquisicion` (más antiguo primero)
2. **Descuento:** Se descuenta primero de los lotes más antiguos
3. **Optimización:** Si un lote se agota (cantidad = 0), se marca como inactivo

### Verificación de Stock
Antes de procesar cualquier venta:

```javascript
// Ejemplo de verificación
{
  "verificaciones": [
    {
      "idProducto": 10,
      "nombre": "Filtro aceite",
      "cantidadRequerida": 2,
      "stockDisponible": 15,
      "suficienteStock": true
    }
  ],
  "stockSuficiente": true,
  "errores": []
}
```

## 📝 Ejemplos de Uso

### Ejemplo 1: Venta con Pago y Descuento

```bash
POST /tallerrepuestos/procesar-venta-pago
Content-Type: application/json

{
  "venta": {
    "tipoventa": "Repuestos y Servicios",
    "totalventa": 275.50,
    "idcliente": 5
  },
  "detalleVenta": [
    {
      "idProducto": 10,
      "nombre": "Filtro de aceite",
      "cantidad": 1,
      "precio": 45.50
    },
    {
      "nombre": "Cambio de aceite",  // ⚠️ Sin idProducto = no se descuenta
      "cantidad": 1,
      "precio": 150.00
    },
    {
      "idProducto": 15,
      "nombre": "Bujías NGK",
      "cantidad": 4,
      "precio": 20.00
    }
  ],
  "metodosPago": [
    {
      "idMetodo": 1,
      "monto": 275.50
    }
  ],
  "nitCliente": "1234567-8"
}
```

### Ejemplo 2: Solo Venta con Inventario

```bash
POST /tallerrepuestos/procesar-venta-inventario
Content-Type: application/json

{
  "venta": {
    "tipoventa": "Repuestos",
    "totalventa": 70.00,
    "idcliente": 3
  },
  "detalleVenta": [
    {
      "idProducto": 8,
      "nombre": "Pastillas de freno",
      "cantidad": 1,
      "precio": 70.00
    }
  ]
}
```

## ⚠️ Manejo de Errores

### Stock Insuficiente
```json
{
  "error": "Stock insuficiente para algunos productos",
  "detalles": [
    "Producto Filtro de aceite (ID: 10): Stock insuficiente. Disponible: 1, Requerido: 2"
  ]
}
```

### Producto Sin ID
```json
{
  "error": "Debe incluir al menos un producto con idProducto para descontar del inventario"
}
```

## 🔄 Integridad Transaccional

El sistema garantiza integridad usando transacciones:

1. **BEGIN:** Inicia transacción
2. **Verificar Stock:** Valida disponibilidad
3. **Crear Venta:** Registra la venta
4. **Procesar Pago:** (si aplica)
5. **Descontar Inventario:** Actualiza lotes
6. **Registrar Movimientos:** Documenta cambios
7. **COMMIT:** Confirma todos los cambios

Si cualquier paso falla → **ROLLBACK** (revierte todo)

## 📊 Seguimiento de Inventario

### Registros Automáticos
Cada descuento genera:

- **Actualización de lote:** Nueva cantidad en `inventariolote`
- **Registro de movimiento:** Entrada en `movimientos` con tipo "salida"
- **Descripción detallada:** "Venta: [nombre del producto]"
- **Log en consola:** Para monitoreo en tiempo real

### Ejemplo de Log
```
📦 Descontado del lote 25: 2 unidades. Restante en lote: 8
✅ Venta 15 procesada con descuento de inventario: 2 productos descontados
```

## 🔧 Configuración

### Variables de Entorno
No se requieren variables adicionales. El sistema usa la configuración existente de la base de datos.

### Dependencias
El sistema utiliza los servicios existentes:
- `querysInventariosl`: Para gestión de lotes
- `querysMovimientoInventario`: Para registro de movimientos
- `querysVentas`: Para creación de ventas

## 📈 Beneficios

1. **Automatización:** No más descuentos manuales
2. **Precisión:** Método FIFO garantiza rotación correcta
3. **Trazabilidad:** Cada movimiento queda registrado
4. **Integridad:** Transacciones garantizan consistencia
5. **Flexibilidad:** Funciona con o sin sistema de pagos
6. **Monitoreo:** Alertas automáticas cuando hay stock bajo

## 🎯 Recomendaciones de Uso

1. **Siempre incluir `idProducto`** para productos físicos
2. **No incluir `idProducto`** para servicios (mano de obra)
3. **Verificar logs** para monitorear descuentos
4. **Usar el endpoint de solo inventario** para ventas internas
5. **Mantener el sistema de alertas activo** para stock bajo

## 📚 Documentación API

La documentación completa está disponible en:
- **Swagger UI:** `/api-docs`
- **Endpoint específico:** `/procesar-venta-inventario`

Para más detalles técnicos, consulta la documentación Swagger del sistema. 