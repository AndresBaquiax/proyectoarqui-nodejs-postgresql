import express from 'express';
import dotenv from 'dotenv';
import config from './config.js';
import cors from 'cors'; 
//Import routes
import empleadosRoutes from './routes/empleados.routes.js';
import clienteRoutes from './routes/cliente.routes.js';
import vehiculoRoutes from './routes/vehiculo.routes.js';
import ventaRoutes from './routes/venta.routes.js';

dotenv.config();
const app = express();

//Settings
app.set('port', config.port);

//Middlewares
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

//Routes
app.use("/tallerrepuestos", empleadosRoutes);
app.use('/api', clienteRoutes);
app.use('/api', vehiculoRoutes);
app.use('/api/ventas', ventaRoutes);

export default app;