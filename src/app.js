import express from 'express';
import dotenv from 'dotenv';
import config from './config.js';
import cors from 'cors'; 
//Import routes
import empleadosRoutes from './routes/empleados.routes.js';
import movimientosRoutes from './routes/movimientos.routes.js';
import preciohistorial from './routes/preciohistorial.routes.js';
import devolucion from './routes/devolution.routes.js';



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
app.use('/api', movimientosRoutes);
app.use('/api', preciohistorial);
app.use('/api', devolucion);

export default app;