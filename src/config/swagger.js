import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración básica de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Mantenimiento de Vehículos - API',
      version: '1.0.0',
      description: 'API REST para el sistema de mantenimiento de vehículos y gestión de taller de repuestos',
      contact: {
        name: 'Diego Andres Baquiax Barrios - 202108036',
        email: 'diego912@umes.edu.gt',
      },
      contact: {
        name: 'Miguel Angel Garcia Sapon - 202108056',
        email: 'miguelg@umes.edu.gt',
      },
      contact: {
        name: 'Enrique Armando Rodriguez Tax - 2022080',
        email: 'enrique_rodri18@umes.edu.gt',
      },
      contact: {
        name: 'Diego Fernando Carpio Alvarado - 2022080',
        email: 'fercar@umes.edu.gt',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000/tallerrepuestos',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://tallerrepuestos.vercel.app/',
        description: 'Servidor de producción'
      }
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de error'
            },
            error: {
              type: 'string',
              description: 'Detalles del error'
            }
          }
        }
      }
    }
  },
  apis: [] // Se llenará dinámicamente
};

// Función para cargar todas las documentaciones YAML
const loadSwaggerDocs = () => {
  const docsPath = path.join(__dirname, '../docs');
  const swaggerFiles = [];
  
  try {
    const files = fs.readdirSync(docsPath);
    files.forEach(file => {
      if (file.endsWith('.swagger.yml')) {
        swaggerFiles.push(path.join(docsPath, file));
      }
    });
  } catch (error) {
    console.warn('No se pudo cargar el directorio de documentación:', error.message);
  }
  
  return swaggerFiles;
};

// Cargar archivos de documentación
swaggerOptions.apis = loadSwaggerDocs();

// Generar especificación de Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Configuración personalizada de Swagger UI
const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #2c3e50; }
    .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 5px; }
  `,
  customSiteTitle: 'Taller Repuestos - API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true
  }
};

export { swaggerSpec, swaggerUi, swaggerUiOptions }; 