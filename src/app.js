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

dotenv.config();
const app = express();

//Settings
app.set('port', config.port);

//Middlewares
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

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


export default app;