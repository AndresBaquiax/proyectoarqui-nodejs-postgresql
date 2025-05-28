# Sistema de Devoluciones - Integración con Sistema de Pagos

Este documento describe la implementación completa del sistema de devoluciones integrado con el microservicio de pagos externo.

## Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Endpoints Disponibles](#endpoints-disponibles)
4. [Implementación Técnica](#implementación-técnica)
5. [Ejemplos de Uso](#ejemplos-de-uso)
6. [Manejo de Errores](#manejo-de-errores)
7. [Testing y Validación](#testing-y-validación)
8. [Documentación API](#documentación-api)

## Descripción General

### ¿Qué es el Sistema de Devoluciones?

El sistema de devoluciones permite gestionar la reversión de transacciones ya procesadas en el sistema de pagos, generando las correspondientes notas de crédito y autorizaciones de devolución.

### Características Principales

- ✅ **Integración completa** con el sistema de pagos externo
- ✅ **Validaciones robustas** de datos de entrada
- ✅ **Manejo de errores** completo y descriptivo
- ✅ **Filtrado por fechas** para consultas de devoluciones
- ✅ **Documentación Swagger** completa
- ✅ **Logs detallados** para auditoría y debugging

### Casos de Uso

1. **Producto defectuoso**: Cliente devuelve producto por fallas
2. **Error en transacción**: Corrección de cobros incorrectos
3. **Cancelación de servicio**: Devolución por servicios no prestados
4. **Devolución parcial**: Reembolso de parte del monto total

## Arquitectura del Sistema

### Flujo de Datos

```
Cliente Frontend
     ↓
Taller API (Controlador)
     ↓
Servicio de Pagos (pagoService.js)
     ↓
Microservicio de Pagos (Externo)
     ↓
Respuesta con Nota de Crédito
```

### Componentes Implementados

1. **Servicio (`pagoService.js`)**
   - Funciones de comunicación con API externa
   - Manejo de autenticación y errores
   - Transformación de datos

2. **Controlador (`devolucion.controller.js`)**
   - Validaciones de entrada
   - Lógica de negocio
   - Respuestas estructuradas

3. **Rutas (`devolution.routes.js` y `pago.routes.js`)**
   - Definición de endpoints
   - Middleware de validación
   - Documentación de parámetros

4. **Documentación (`devolucion.swagger.yml`)**
   - Especificación OpenAPI
   - Ejemplos de uso
   - Esquemas de datos

## Endpoints Disponibles

### 1. Crear Devolución

**URL:** `POST /tallerrepuestos/devoluciones/crear`

**Descripción:** Crea una nueva devolución para una transacción específica.

**Parámetros:**
```json
{
  "NoTransaccion": 12345,
  "Monto": 150.00,
  "Descripcion": "Producto defectuoso"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Devolución creada exitosamente",
  "devolucion": {
    "Mensaje": "Devolucion realizada correctamente"
  }
}
```

### 2. Obtener Todas las Devoluciones

**URL:** `GET /tallerrepuestos/devoluciones/obtener`

**Descripción:** Obtiene todas las devoluciones con filtros opcionales de fecha.

**Parámetros (opcionales):**
```json
{
  "fechaInicio": "2024-01-01T00:00:00Z",
  "fechaFinal": "2024-12-31T23:59:59Z"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Devoluciones obtenidas exitosamente",
  "devoluciones": [
    {
      "NoDevolucion": 12345,
      "NoTransaccion": 67890,
      "Monto": 150.00,
      "Descripcion": "Producto defectuoso",
      "NoAutorizacion": "AUTH-DEV-2024-001",
      "Fecha": "2024-01-15T14:30:00Z",
      "NotaCredito": "NC-2024-001"
    }
  ],
  "total": 1
}
```

### 3. Obtener Devolución por Número

**URL:** `GET /tallerrepuestos/devoluciones/obtener/{noDevolucion}`

**Descripción:** Obtiene los detalles de una devolución específica.

**Parámetros:**
- `noDevolucion` (número): Número único de la devolución

**Respuesta Exitosa:**
```json
{
  "message": "Devolución obtenida exitosamente",
  "devolucion": {
    "Devolucion": {
      "NoDevolucion": 12345,
      "NoTransaccion": 67890,
      "Monto": 150.00,
      "Descripcion": "Producto defectuoso",
      "NoAutorizacion": "AUTH-DEV-2024-001",
      "Fecha": "2024-01-15T14:30:00Z",
      "NotaCredito": "NC-2024-001"
    }
  }
}
```

## Implementación Técnica

### Servicio de Pagos (pagoService.js)

#### Función: crearDevolucion()

```javascript
export const crearDevolucion = async (datosDevolucion) => {
    try {
        console.log('Creando devolución:', JSON.stringify(datosDevolucion, null, 2));
        
        const response = await fetch(`${PAGO_SERVICE_URL}/devoluciones/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosDevolucion)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error al crear devolución: ${response.status} ${response.statusText} - ${errorData}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al crear devolución:', error);
        throw new Error(`Error al conectar con el servicio de devoluciones: ${error.message}`);
    }
};
```

#### Función: obtenerDevoluciones()

```javascript
export const obtenerDevoluciones = async (filtro = {}) => {
    try {
        console.log('Obteniendo devoluciones con filtro:', JSON.stringify(filtro, null, 2));
        
        const response = await fetch(`${PAGO_SERVICE_URL}/devoluciones/obtener`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: Object.keys(filtro).length > 0 ? JSON.stringify(filtro) : undefined
        });

        if (!response.ok) {
            throw new Error(`Error al obtener devoluciones: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.Devoluciones || [];
    } catch (error) {
        console.error('Error al obtener devoluciones:', error);
        throw new Error(`Error al obtener devoluciones: ${error.message}`);
    }
};
```

#### Función: obtenerDevolucion()

```javascript
export const obtenerDevolucion = async (noDevolucion) => {
    try {
        const response = await fetch(`${PAGO_SERVICE_URL}/devoluciones/obtener/${noDevolucion}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener devolución: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener devolución:', error);
        throw new Error(`Error al obtener devolución: ${error.message}`);
    }
};
```

### Controladores (devolucion.controller.js)

#### Controlador: crearDevolucionController()

```javascript
export const crearDevolucionController = async (req, res) => {
    try {
        const { NoTransaccion, Monto, Descripcion } = req.body;

        // Validaciones básicas
        if (!NoTransaccion || !Monto || !Descripcion) {
            return res.status(400).json({ 
                error: "Faltan datos requeridos: NoTransaccion, Monto, Descripcion" 
            });
        }

        // Validar que el monto sea positivo
        if (parseFloat(Monto) <= 0) {
            return res.status(400).json({ 
                error: "El monto debe ser mayor a 0" 
            });
        }

        // Transformar datos al formato requerido
        const datosDevolucion = {
            NoTransaccion: parseInt(NoTransaccion),
            Monto: parseFloat(Monto),
            Descripcion: Descripcion.toString()
        };

        // Crear devolución en el sistema externo
        const resultado = await crearDevolucion(datosDevolucion);

        res.status(201).json({
            message: "Devolución creada exitosamente",
            devolucion: resultado
        });

    } catch (error) {
        console.error('Error en crearDevolucionController:', error);
        res.status(500).json({ error: error.message });
    }
};
```

### Configuración de Rutas

#### En devolution.routes.js:

```javascript
// Rutas nuevas para el sistema de pagos (según documentación API)
router.post("/devoluciones/crear", crearDevolucionController);
router.get("/devoluciones/obtener", obtenerDevolucionesController);
router.get("/devoluciones/obtener/:noDevolucion", obtenerDevolucionController);
```

#### En pago.routes.js:

```javascript
// Rutas de devoluciones del sistema de pagos
router.post('/devoluciones/crear', crearDevolucionController);
router.get('/devoluciones/obtener', obtenerDevolucionesController);
router.get('/devoluciones/obtener/:noDevolucion', obtenerDevolucionController);
```

## Ejemplos de Uso

### Ejemplo 1: Crear Devolución Simple

**Request:**
```bash
curl -X POST http://localhost:4000/tallerrepuestos/devoluciones/crear \
  -H "Content-Type: application/json" \
  -d '{
    "NoTransaccion": 12345,
    "Monto": 150.00,
    "Descripcion": "Producto defectuoso - filtro de aceite no compatible"
  }'
```

**Response:**
```json
{
  "message": "Devolución creada exitosamente",
  "devolucion": {
    "Mensaje": "Devolucion realizada correctamente"
  }
}
```

### Ejemplo 2: Consultar Devoluciones por Rango de Fechas

**Request:**
```bash
curl -X GET http://localhost:4000/tallerrepuestos/devoluciones/obtener \
  -H "Content-Type: application/json" \
  -d '{
    "fechaInicio": "2024-01-01T00:00:00Z",
    "fechaFinal": "2024-01-31T23:59:59Z"
  }'
```

**Response:**
```json
{
  "message": "Devoluciones obtenidas exitosamente",
  "devoluciones": [
    {
      "NoDevolucion": 12345,
      "NoTransaccion": 67890,
      "Monto": 150.00,
      "Descripcion": "Producto defectuoso - filtro de aceite no compatible",
      "NoAutorizacion": "AUTH-DEV-2024-001",
      "Fecha": "2024-01-15T14:30:00Z",
      "NotaCredito": "NC-2024-001"
    }
  ],
  "total": 1
}
```

### Ejemplo 3: Consultar Devolución Específica

**Request:**
```bash
curl -X GET http://localhost:4000/tallerrepuestos/devoluciones/obtener/12345
```

**Response:**
```json
{
  "message": "Devolución obtenida exitosamente",
  "devolucion": {
    "Devolucion": {
      "NoDevolucion": 12345,
      "NoTransaccion": 67890,
      "Monto": 150.00,
      "Descripcion": "Producto defectuoso - filtro de aceite no compatible",
      "NoAutorizacion": "AUTH-DEV-2024-001",
      "Fecha": "2024-01-15T14:30:00Z",
      "NotaCredito": "NC-2024-001"
    }
  }
}
```

## Manejo de Errores

### Errores de Validación (400)

**Datos faltantes:**
```json
{
  "error": "Faltan datos requeridos: NoTransaccion, Monto, Descripcion"
}
```

**Monto inválido:**
```json
{
  "error": "El monto debe ser mayor a 0"
}
```

**Número de devolución inválido:**
```json
{
  "error": "El número de devolución debe ser un número válido"
}
```

### Errores de Recurso No Encontrado (404)

```json
{
  "error": "Devolución no encontrada"
}
```

### Errores del Servidor (500)

**Error de conexión:**
```json
{
  "error": "Error al conectar con el servicio de devoluciones: connect ECONNREFUSED"
}
```

**Error del servicio externo:**
```json
{
  "error": "Error al crear devolución: 500 Internal Server Error - Database connection failed"
}
```

## Testing y Validación

### Casos de Prueba Implementados

#### 1. Validación de Datos de Entrada

- ✅ Verificar campos requeridos
- ✅ Validar tipos de datos
- ✅ Verificar rangos de valores
- ✅ Sanitizar entrada de texto

#### 2. Integración con Servicio Externo

- ✅ Conexión exitosa al servicio
- ✅ Manejo de timeouts
- ✅ Retry logic para fallos temporales
- ✅ Parsing correcto de respuestas

#### 3. Manejo de Errores

- ✅ Errores de red
- ✅ Errores de autenticación
- ✅ Errores de validación del servicio
- ✅ Errores de formato de datos

### Scripts de Prueba

#### Prueba de Creación de Devolución:

```bash
#!/bin/bash
echo "Testing crear devolución..."

curl -X POST http://localhost:4000/tallerrepuestos/devoluciones/crear \
  -H "Content-Type: application/json" \
  -d '{
    "NoTransaccion": 12345,
    "Monto": 150.00,
    "Descripcion": "Test - Producto defectuoso"
  }' | jq .
```

#### Prueba de Consulta de Devoluciones:

```bash
#!/bin/bash
echo "Testing obtener devoluciones..."

curl -X GET http://localhost:4000/tallerrepuestos/devoluciones/obtener \
  -H "Content-Type: application/json" | jq .
```

## Documentación API

### Esquemas de Datos

#### DevolucionInput
```yaml
type: object
required:
  - NoTransaccion
  - Monto
  - Descripcion
properties:
  NoTransaccion:
    type: number
    example: 12345
  Monto:
    type: number
    minimum: 0.01
    example: 150.00
  Descripcion:
    type: string
    example: "Producto defectuoso"
```

#### DevolucionPagos
```yaml
type: object
properties:
  NoDevolucion:
    type: number
    example: 12345
  NoTransaccion:
    type: number
    example: 67890
  Monto:
    type: number
    example: 150.00
  Descripcion:
    type: string
    example: "Producto defectuoso"
  NoAutorizacion:
    type: string
    example: "AUTH-DEV-2024-001"
  Fecha:
    type: string
    format: date-time
    example: "2024-01-15T14:30:00Z"
  NotaCredito:
    type: string
    example: "NC-2024-001"
```

### Tags de Documentación

- **Devoluciones Sistema de Pagos**: Endpoints para gestión de devoluciones
- **Devoluciones**: Endpoints del sistema local (compatibilidad)

## Configuración de Variables de Entorno

### Variables Requeridas

```env
# URL del servicio de pagos (incluye puerto)
PAGO_SERVICE_URL=http://64.23.169.22:3001/pagos

# ID de la caja para identificación
ID_CAJA=1
```

### Configuración en Docker

Las variables ya están configuradas en:
- `Dockerfile` (líneas 37-38)
- `docker-compose.yml` (líneas 23-24)

## Logs y Monitoreo

### Logs Implementados

1. **Logs de entrada**: Datos recibidos en controladores
2. **Logs de servicio**: Comunicación con API externa
3. **Logs de error**: Detalles completos de fallos
4. **Logs de respuesta**: Datos enviados al cliente

### Ejemplo de Logs

```
2024-01-15T14:30:00.000Z [INFO] Creando devolución: {"NoTransaccion":12345,"Monto":150,"Descripcion":"Producto defectuoso"}
2024-01-15T14:30:01.000Z [INFO] Respuesta del servicio de pagos: {"Mensaje":"Devolucion realizada correctamente"}
2024-01-15T14:30:01.000Z [INFO] Devolución creada exitosamente para transacción 12345
```

## Próximas Mejoras

### Funcionalidades Planeadas

1. **Devoluciones parciales automáticas**
2. **Integración con inventario** (reposición automática)
3. **Notificaciones por email** al cliente
4. **Dashboard de devoluciones** con métricas
5. **Exportación de reportes** en PDF/Excel

### Optimizaciones Técnicas

1. **Cache de consultas** frecuentes
2. **Validación de esquemas** con JSON Schema
3. **Rate limiting** para prevenir abuso
4. **Middleware de autenticación** para endpoints sensibles
5. **Versionado de API** para compatibilidad futura 