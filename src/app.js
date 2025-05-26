import express from 'express';
import dotenv from 'dotenv';
import config from './config.js';
import cors from 'cors'; 
//Import routes
import empleadosRoutes from './routes/empleados.routes.js';
import clienteRoutes from './routes/cliente.routes.js';
import vehiculoRoutes from './routes/vehiculo.routes.js';
import tiposervicioRoutes from './routes/tiposervicio.routes.js';
import servicioRoutes from './routes/servicio.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';
import productosRoutes from './routes/productos.routes.js';
import inventarioslRoutes from './routes/inventariosl.routes.js';
import movimientosRoutes from './routes/movimientos.routes.js';
import preciohistoriaRoutes from './routes/preciohistorial.routes.js';
import ventaRoutes from './routes/venta.routes.js';
import preciohistorial from './routes/preciohistorial.routes.js';
import devolucion from './routes/devolution.routes.js';
import pagoRoutes from './routes/pago.routes.js';
//Import Swagger configuration
import { swaggerSpec, swaggerUi, swaggerUiOptions } from './config/swagger.js';

dotenv.config();
const app = express();

//Settings
app.set('port', config.port);

//Middlewares
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

//Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

//Routes
app.use("/tallerrepuestos", categoriasRoutes);
app.use("/tallerrepuestos", empleadosRoutes);
app.use('/tallerrepuestos', clienteRoutes);
app.use('/tallerrepuestos', vehiculoRoutes);
app.use("/tallerrepuestos", tiposervicioRoutes);
app.use("/tallerrepuestos", servicioRoutes);
app.use("/tallerrepuestos", productosRoutes);
app.use("/tallerrepuestos", inventarioslRoutes);
app.use("/tallerrepuestos", movimientosRoutes);
app.use("/tallerrepuestos", preciohistoriaRoutes);
app.use('/tallerrepuestos', ventaRoutes);
app.use('/tallerrepuestos', preciohistorial);
app.use('/tallerrepuestos', devolucion);
app.use('/tallerrepuestos', pagoRoutes);

// Ruta de información de la API
app.get('/', (req, res) => {
  res.json({
    message: 'Sistema de Mantenimiento de Vehículos - API',
    version: '1.0.0',
    description: 'API REST para gestión integral de taller de repuestos y mantenimiento vehicular',
    documentation: '/api-docs',
    endpoints: {
      empleados: '/tallerrepuestos/empleados',
      clientes: '/tallerrepuestos/clientes',
      vehiculos: '/tallerrepuestos/vehiculos',
      tiposervicios: '/tallerrepuestos/tiposervicios',      
      servicios: '/tallerrepuestos/servicios',      
      categorias: '/tallerrepuestos/categorias',
      productos: '/tallerrepuestos/productos',
      inventariosl: '/tallerrepuestos/inventariosl',
      movimientos: '/tallerrepuestos/movimientos',
      preciohistorial: '/tallerrepuestos/preciohistorial',
      ventas: '/tallerrepuestos/ventas',
      devoluciones: '/tallerrepuestos/devolucion'
    },
    features: [
      'Gestión de empleados y clientes',
      'Registro de vehículos y servicios',
      'Control de inventario por lotes',
      'Seguimiento de movimientos de stock',
      'Historial de precios',
      'Procesamiento de ventas y devoluciones',
      'Documentación Swagger completa'
    ]
  });
});

export default app;