import pkg from 'pg';
const { Pool } = pkg; // Extrae Pool del paquete CommonJS

import config from '../config.js';

const dbsettings = {
    host: config.dbServer,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbDatabase,
    port: config.dbPort, // Puerto por defecto de PostgreSQL
};

const pool = new Pool(dbsettings);

export async function getConnection() {
    try {
        const client = await pool.connect();
        return client;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

export { pool };