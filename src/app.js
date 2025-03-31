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
app.use('/tallerrepuestos', clienteRoutes);
app.use('/tallerrepuestos', vehiculoRoutes);
app.use("/tallerrepuestos", tiposervicioRoutes);
app.use("/tallerrepuestos", servicioRoutes);


export default app;