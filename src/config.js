import { config } from 'dotenv'
config();

export default {
    secretKey: process.env.SECRET_KEY || '',
    port: process.env.PORT || 4000,
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbServer: process.env.DB_SERVER || '',
    dbDatabase: process.env.DB_DATABASE || '',
    dbPort: process.env.DB_PORT || ''
}