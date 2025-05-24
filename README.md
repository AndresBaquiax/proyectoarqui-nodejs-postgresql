# Sistema de Mantenimiento de Vehículos - API

API REST para el sistema de mantenimiento de vehículos y gestión de taller de repuestos.

## 🚀 Características

- **API REST completa** con operaciones CRUD
- **Documentación interactiva** con Swagger UI
- **Base de datos PostgreSQL** con Supabase
- **Contenedorización** con Docker
- **Arquitectura modular** y escalable
- **12 módulos completamente documentados**

## 📋 Módulos Disponibles

- **Empleados** - Gestión de empleados del taller
- **Clientes** - Administración de clientes
- **Vehículos** - Registro de vehículos de clientes
- **Tipos de Servicio** - Catálogo de servicios ofrecidos
- **Servicios** - Gestión de servicios realizados
- **Categorías** - Clasificación de productos/repuestos
- **Productos** - Inventario de repuestos y autopartes
- **Inventario por Lotes** - Control de stock por lotes
- **Movimientos de Inventario** - Seguimiento de entradas/salidas
- **Precio Historial** - Historial de cambios de precios
- **Ventas** - Registro de transacciones
- **Devoluciones** - Gestión de devoluciones de productos

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **Swagger** - Documentación de API
- **Docker** - Contenedorización
- **Supabase** - Backend como servicio

## 📖 Documentación de la API

### Swagger UI

La documentación interactiva de la API está disponible en:

```
http://localhost:4000/api-docs
```

### Endpoints Principales

Todos los endpoints están bajo el prefijo `/tallerrepuestos`:

- **Empleados**: `/tallerrepuestos/empleados`
- **Clientes**: `/tallerrepuestos/clientes`
- **Vehículos**: `/tallerrepuestos/vehiculos`
- **Tipos de Servicio**: `/tallerrepuestos/tiposervicios`
- **Servicios**: `/tallerrepuestos/servicios`
- **Categorías**: `/tallerrepuestos/categorias`
- **Productos**: `/tallerrepuestos/productos`
- **Inventario por Lotes**: `/tallerrepuestos/inventariosl`
- **Movimientos**: `/tallerrepuestos/movimientos`
- **Precio Historial**: `/tallerrepuestos/preciohistorial`
- **Ventas**: `/tallerrepuestos/ventas`
- **Devoluciones**: `/tallerrepuestos/devolucion`

### Información de la API

```bash
GET http://localhost:4000/
```

Retorna información general de la API y enlaces a los endpoints principales.

## 🚀 Inicio Rápido

### Usando Docker (Recomendado)

```bash
# Ejecutar directamente desde Docker Hub
docker run -p 4000:4000 umesmicros/taller-repuestos
```

La aplicación estará disponible en `http://localhost:4000`

### Desarrollo Local

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd nodejs-postgresql
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

5. **Ejecutar en producción**
```bash
npm start
```

## 🐳 Docker

### Construir imagen local

```bash
docker build -t taller-repuestos .
```

### Ejecutar contenedor

```bash
docker run -p 4000:4000 taller-repuestos
```

### Docker Compose

```bash
docker-compose up -d
```

## 📝 Ejemplos de Uso

### 👥 Clientes

#### Obtener todos los clientes
```bash
curl -X GET http://localhost:4000/tallerrepuestos/clientes
```

#### Crear un nuevo cliente
```bash
curl -X POST http://localhost:4000/tallerrepuestos/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "apellido": "Pérez García",
    "nit": "12345678-9",
    "telefono": "2234-5678",
    "email": "juan.perez@email.com",
    "status": 1
  }'
```

#### Obtener un cliente específico
```bash
curl -X GET http://localhost:4000/tallerrepuestos/clientes/1
```

### 🚗 Vehículos

#### Crear un nuevo vehículo
```bash
curl -X POST http://localhost:4000/tallerrepuestos/vehiculos \
  -H "Content-Type: application/json" \
  -d '{
    "placa": "P123ABC",
    "marca": "Toyota",
    "modelo": "Corolla",
    "anio": 2020,
    "tipovehiculo": "Sedán",
    "idcliente": 5,
    "status": 1
  }'
```

#### Obtener todos los vehículos
```bash
curl -X GET http://localhost:4000/tallerrepuestos/vehiculos
```

### 🛠️ Productos

#### Obtener todos los productos
```bash
curl -X GET http://localhost:4000/tallerrepuestos/productos
```

#### Crear un nuevo producto
```bash
curl -X POST http://localhost:4000/tallerrepuestos/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Filtro de aceite Toyota",
    "descripcion": "Filtro de aceite compatible con motores Toyota 1.8L y 2.0L",
    "precio": 85.50,
    "id_categoria": 3,
    "existencia_minima": 15,
    "status": 1
  }'
```

#### Reabastecer stock de un producto
```bash
curl -X POST http://localhost:4000/tallerrepuestos/productos/abastecer \
  -H "Content-Type: application/json" \
  -d '{
    "idProducto": 15,
    "cantidad": 50
  }'
```

### 📦 Inventario por Lotes

#### Obtener inventario por lotes
```bash
curl -X GET http://localhost:4000/tallerrepuestos/inventariosl
```

#### Crear un nuevo lote
```bash
curl -X POST http://localhost:4000/tallerrepuestos/inventariosl \
  -H "Content-Type: application/json" \
  -d '{
    "idproducto": 15,
    "cantidad": 100,
    "fechaadquisicion": "2025-01-15",
    "activo": 1
  }'
```

### 📊 Movimientos de Inventario

#### Registrar movimiento de inventario
```bash
curl -X POST http://localhost:4000/tallerrepuestos/movimientos \
  -H "Content-Type: application/json" \
  -d '{
    "idlote": 5,
    "idproducto": 15,
    "cantidad": 10,
    "tipo": "salida",
    "descripcion": "Venta de filtros de aceite a cliente"
  }'
```

### 💰 Ventas

#### Crear una nueva venta
```bash
curl -X POST http://localhost:4000/tallerrepuestos/ventas \
  -H "Content-Type: application/json" \
  -d '{
    "tipoventa": "Repuestos",
    "fechaventa": "2025-01-15",
    "totalventa": 450.75,
    "idcliente": 5,
    "status": 1
  }'
```

#### Obtener todas las ventas
```bash
curl -X GET http://localhost:4000/tallerrepuestos/ventas
```

### 📈 Precio Historial

#### Registrar cambio de precio
```bash
curl -X POST http://localhost:4000/tallerrepuestos/preciohistorial \
  -H "Content-Type: application/json" \
  -d '{
    "idproducto": 15,
    "precioanterior": 125.50,
    "precionuevo": 135.75
  }'
```

### 🔄 Devoluciones

#### Crear una nueva devolución
```bash
curl -X POST http://localhost:4000/tallerrepuestos/devolucion \
  -H "Content-Type: application/json" \
  -d '{
    "fecharealizada": "2025-01-15",
    "motivo": "Producto defectuoso - no funciona correctamente",
    "monto": 150.75,
    "idventa": 5
  }'
```

#### Obtener todas las devoluciones
```bash
curl -X GET http://localhost:4000/tallerrepuestos/devolucion
```

### 👨‍💼 Empleados

#### Crear un nuevo empleado
```bash
curl -X POST http://localhost:4000/tallerrepuestos/empleados \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos",
    "apellido": "Méndez",
    "telefono": "2234-5678",
    "email": "carlos.mendez@taller.com",
    "puesto": "Mecánico Senior",
    "salario": 4500.00
  }'
```

### 🏷️ Categorías

#### Crear una nueva categoría
```bash
curl -X POST http://localhost:4000/tallerrepuestos/categorias \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Repuestos de motor",
    "descripcion": "Componentes y repuestos para motores de vehículos",
    "status": 1
  }'
```

### ⚙️ Servicios

#### Crear un nuevo servicio
```bash
curl -X POST http://localhost:4000/tallerrepuestos/servicios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Cambio de aceite completo",
    "descripcion": "Cambio de aceite de motor con filtro incluido",
    "precio": 250.00
  }'
```

## 🔧 Configuración

### Variables de Entorno

```env
PORT=4000
DB_USER=postgres
DB_PASSWORD=your_password
DB_SERVER=your_server
DB_DATABASE=your_database
DB_PORT=5432
SECRET_KEY=your_secret_key
```

### Base de Datos

La aplicación está configurada para usar Supabase por defecto. Las credenciales están incluidas en la imagen Docker para facilitar el uso inmediato.

## 📁 Estructura del Proyecto

```
├── src/
│   ├── config/
│   │   └── swagger.js          # Configuración de Swagger
│   ├── controllers/            # Controladores de la API
│   │   ├── cliente.controller.js
│   │   ├── empleados.controller.js
│   │   ├── vehiculo.controller.js
│   │   ├── productos.controller.js
│   │   ├── venta.controller.js
│   │   └── ...
│   ├── database/              # Configuración de base de datos
│   │   ├── connection.js
│   │   └── querys.js
│   ├── docs/                  # Documentación Swagger por módulo
│   │   ├── cliente.swagger.yml
│   │   ├── empleados.swagger.yml
│   │   ├── vehiculo.swagger.yml
│   │   ├── productos.swagger.yml
│   │   ├── venta.swagger.yml
│   │   ├── categorias.swagger.yml
│   │   ├── devolucion.swagger.yml
│   │   ├── inventariosl.swagger.yml
│   │   ├── movimientos.swagger.yml
│   │   ├── preciohistorial.swagger.yml
│   │   ├── servicio.swagger.yml
│   │   └── tiposervicio.swagger.yml
│   ├── routes/                # Rutas de la API
│   │   ├── cliente.routes.js
│   │   ├── empleados.routes.js
│   │   ├── vehiculo.routes.js
│   │   ├── productos.routes.js
│   │   ├── venta.routes.js
│   │   └── ...
│   ├── app.js                 # Configuración de Express
│   └── index.js               # Punto de entrada
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## 🎯 Funcionalidades Principales

### Gestión de Clientes y Vehículos
- Registro completo de clientes con información de contacto
- Asociación de vehículos a clientes
- Historial de servicios por vehículo

### Control de Inventario
- Gestión de productos por lotes
- Seguimiento de movimientos de entrada y salida
- Control de existencias mínimas
- Historial de cambios de precios

### Procesamiento de Ventas
- Registro de ventas con diferentes tipos
- Sistema de devoluciones
- Asociación de ventas a clientes

### Gestión de Servicios
- Catálogo de tipos de servicios
- Registro de servicios realizados
- Gestión de empleados y roles

## 🚀 Despliegue

### Imagen Docker Pública

La aplicación está disponible como imagen pública en Docker Hub:

```bash
docker pull umesmicros/taller-repuestos
docker run -p 4000:4000 umesmicros/taller-repuestos
```

### Características de la Imagen
- **Configuración lista para usar** con Supabase
- **Variables de entorno incluidas**
- **Documentación Swagger completa**
- **Todos los módulos funcionales**

## 📚 Documentación Adicional

- **Swagger UI**: `http://localhost:4000/api-docs`
- **API Info**: `http://localhost:4000/`
- **Repositorio**: [GitHub Repository]

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor
- Diego Andres Baquiax Barrios
- Miguel Angel Garcia Sapon
- Enrique Armando Rodriguez Tax
- Diego Fernango Carpio Alvarado

**Proyecto Final - Arquitectura de Sistemas II**
- Universidad: Universidad Mesoamericana - Sede Quetzaltenango
- Semestre: 7mo Semestre
- Año: 2025

---

**Nota**: Esta API está diseñada para fines educativos y de demostración. Para uso en producción, considera implementar autenticación, validación adicional y otras medidas de seguridad.
