import express from 'express';
import dotenv from 'dotenv';
import config from './config.js';
import cors from 'cors'; 
//Import routes
import empleadosRoutes from './routes/empleados.routes.js';
import movimientoRoutes from './routes/movimiento.routes.js';
import precioH from './routes/precioH.routes.js';


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
app.use('/api', movimientoRoutes);
app.use('/api', precioH);

export default app;