import express from 'express';
import dotenv from 'dotenv';
import config from './config.js';
import cors from 'cors'; 
//Import routes


dotenv.config();
const app = express();

//Settings
app.set('port', config.port);

//Middlewares
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

//Routes



export default app;