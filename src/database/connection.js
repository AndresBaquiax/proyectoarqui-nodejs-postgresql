import postgresql from 'pg';
import config from '../config.js';

const dbsettings = {
    host: config.dbServer,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbDatabase,
};

export async function getConnection() {
    try {
        const connection = await postgresql.createConnection(dbsettings);
        return connection;
    } catch (error) {
        console.log(error);
    }
}

export { postgresql };