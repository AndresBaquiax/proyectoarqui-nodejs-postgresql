# Documentación de Dockerización - Sistema de Taller de Repuestos

Este documento describe el proceso completo de dockerización del sistema de taller de repuestos, incluyendo la configuración, construcción y despliegue en Docker Hub.

## Tabla de Contenidos
1. [Estructura de Archivos Docker](#estructura-de-archivos-docker)
2. [Configuración del Dockerfile](#configuración-del-dockerfile)
3. [Configuración de Docker Compose](#configuración-de-docker-compose)
4. [Variables de Entorno](#variables-de-entorno)
5. [Proceso de Construcción](#proceso-de-construcción)
6. [Despliegue en Docker Hub](#despliegue-en-docker-hub)
7. [Comandos Útiles](#comandos-útiles)
8. [Troubleshooting](#troubleshooting)

## Estructura de Archivos Docker

```
nodejs-postgresql/
├── Dockerfile                 # Configuración principal del contenedor
├── docker-compose.yml         # Orquestación de servicios
├── start.sh                   # Script de inicio de la aplicación
├── .dockerignore              # Archivos a excluir en la construcción
└── .envexample                # Ejemplo de variables de entorno
```

## Configuración del Dockerfile

### Características Principales

**Imagen Base:** `node:22-alpine`
- Versión ligera de Node.js 22
- Menor tamaño de imagen
- Mayor seguridad

**Dependencias del Sistema:**
```dockerfile
RUN apk add --no-cache dumb-init curl
```
- `dumb-init`: Manejo adecuado de señales del sistema
- `curl`: Para health checks

**Seguridad:**
```dockerfile
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
```
- Usuario no-root para mayor seguridad
- UID/GID específicos para consistencia

### Variables de Entorno Configuradas

```dockerfile
# Configuración del servidor
ENV PORT=4000

# Configuración de base de datos (Supabase)
ENV DB_USER=postgres.maxorwwewaasdoxrcxoc
ENV DB_PASSWORD=iXM3YRf9Z6LkfQ3j
ENV DB_SERVER=aws-0-us-east-1.pooler.supabase.com
ENV DB_DATABASE=postgres
ENV DB_PORT=6543

# Configuración de seguridad
ENV SECRET_KEY=umesmicros_secret_key_2024

# Configuración del sistema de pagos
ENV PAGO_SERVICE_URL=http://64.23.169.22:3001/pagos
ENV ID_CAJA=1
```

### Proceso de Construcción en el Dockerfile

1. **Instalación de dependencias:**
   ```dockerfile
   COPY package*.json ./
   RUN npm ci --only=production && npm cache clean --force
   ```

2. **Copia del código fuente:**
   ```dockerfile
   COPY . .
   RUN chmod +x start.sh
   ```

3. **Configuración de permisos:**
   ```dockerfile
   RUN chown -R nodejs:nodejs /app
   ```

4. **Configuración de inicio:**
   ```dockerfile
   ENTRYPOINT ["dumb-init", "--"]
   CMD ["./start.sh"]
   ```

## Configuración de Docker Compose

### Servicios Definidos

**Servicio Principal: `nodejs-app`**
```yaml
services:
  nodejs-app:
    container_name: taller-repuestos
    image: umesmicros/taller-repuestos
    build:
      context: .
      dockerfile: Dockerfile
```

### Variables de Entorno en Docker Compose

```yaml
environment:
  NODE_ENV: production
  SECRET_KEY: f6e11bffbb342444ce15c240fb7aa588a9dfd2b84706a3a0b5035b78f8ee38f090b63ed992af97f48c2c2b1f9b83af7824abe254be1d7e43c7123d920ce0c52a
  PORT: 4000
  
  # Base de datos
  DB_USER: postgres.maxorwwewaasdoxrcxoc
  DB_PASSWORD: iXM3YRf9Z6LkfQ3j
  DB_SERVER: aws-0-us-east-1.pooler.supabase.com
  DB_DATABASE: postgres
  DB_PORT: 6543
  
  # Sistema de pagos
  PAGO_SERVICE_URL: http://64.23.169.22:3001/pagos
  ID_CAJA: 1
```

### Configuración de Red y Volúmenes

```yaml
ports:
  - "4000:4000"

volumes:
  # Para desarrollo: hot-reload
  - ./src:/app/src:ro
  - ./package.json:/app/package.json:ro

networks:
  - mantenimiento-network

dns:
  - 8.8.8.8
  - 8.8.4.4
```

### Health Check

```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:4000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## Variables de Entorno

### Configuración de Producción vs Desarrollo

**Desarrollo (.env local):**
```env
PORT=4000
DB_USER=postgres
DB_PASSWORD=root
DB_SERVER=localhost
DB_DATABASE=taller_repuestos
DB_PORT=5432
PAGO_SERVICE_URL=http://localhost:3001/pagos
ID_CAJA=1
```

**Producción (Docker):**
- Utiliza Supabase como base de datos
- Servicio de pagos en servidor externo
- Variables hardcodeadas en el Dockerfile y docker-compose.yml

### Generación de SECRET_KEY

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Proceso de Construcción

### Paso 1: Preparación

1. **Verificar archivos necesarios:**
   ```bash
   ls -la Dockerfile docker-compose.yml start.sh
   ```

2. **Verificar .dockerignore:**
   ```
   node_modules
   .git
   .env
   *.md
   ```

### Paso 2: Construcción Local

```bash
# Construir la imagen localmente
docker build -t umesmicros/taller-repuestos .

# Verificar la imagen
docker images | grep taller-repuestos
```

### Paso 3: Prueba Local

```bash
# Ejecutar con docker-compose
docker-compose up -d

# Verificar logs
docker-compose logs -f nodejs-app

# Verificar health check
docker ps
```

### Paso 4: Pruebas de Funcionalidad

```bash
# Verificar endpoint de salud
curl http://localhost:4000/health

# Verificar API principal
curl http://localhost:4000/tallerrepuestos/bancos
```

## Despliegue en Docker Hub

### Paso 1: Autenticación

```bash
# Login en Docker Hub
docker login

# Autenticación web si es necesario
# Seguir las instrucciones del navegador
```

### Paso 2: Construcción para Producción

```bash
# Construir imagen final
docker build -t umesmicros/taller-repuestos .

# Verificar construcción exitosa
docker images umesmicros/taller-repuestos
```

### Paso 3: Subida a Docker Hub

```bash
# Subir imagen al repositorio
docker push umesmicros/taller-repuestos

# Verificar subida exitosa
# La imagen estará disponible en: https://hub.docker.com/r/umesmicros/taller-repuestos
```

### Paso 4: Verificación

```bash
# Eliminar imagen local y descargar desde Docker Hub
docker rmi umesmicros/taller-repuestos
docker pull umesmicros/taller-repuestos

# Ejecutar imagen descargada
docker run -p 4000:4000 umesmicros/taller-repuestos
```

## Comandos Útiles

### Gestión de Contenedores

```bash
# Ver contenedores en ejecución
docker ps

# Ver todos los contenedores
docker ps -a

# Parar contenedor específico
docker stop taller-repuestos

# Eliminar contenedor
docker rm taller-repuestos

# Ver logs en tiempo real
docker logs -f taller-repuestos
```

### Gestión de Imágenes

```bash
# Listar imágenes
docker images

# Eliminar imagen
docker rmi umesmicros/taller-repuestos

# Limpiar imágenes no utilizadas
docker image prune

# Información de la imagen
docker inspect umesmicros/taller-repuestos
```

### Docker Compose

```bash
# Levantar servicios
docker-compose up -d

# Ver logs de todos los servicios
docker-compose logs -f

# Parar servicios
docker-compose down

# Reconstruir servicios
docker-compose build

# Levantar con reconstrucción
docker-compose up --build -d
```

### Debugging

```bash
# Ejecutar bash dentro del contenedor
docker exec -it taller-repuestos /bin/sh

# Ver variables de entorno
docker exec taller-repuestos env

# Ver procesos en el contenedor
docker exec taller-repuestos ps aux

# Verificar conectividad
docker exec taller-repuestos ping google.com
```

## Troubleshooting

### Problemas Comunes

#### 1. Error de Autenticación en Docker Hub

**Síntoma:**
```
unauthorized: authentication required
```

**Solución:**
```bash
docker logout
docker login
# Seguir proceso de autenticación web
```

#### 2. Error de Construcción por Dependencias

**Síntoma:**
```
npm ERR! Cannot resolve dependency
```

**Solución:**
```bash
# Limpiar cache npm local
npm cache clean --force

# Eliminar node_modules local
rm -rf node_modules

# Reconstruir imagen
docker build --no-cache -t umesmicros/taller-repuestos .
```

#### 3. Error de Conexión a Base de Datos

**Síntoma:**
```
Error: connect ECONNREFUSED
```

**Verificación:**
```bash
# Verificar variables de entorno
docker exec taller-repuestos env | grep DB_

# Probar conectividad desde el contenedor
docker exec taller-repuestos ping aws-0-us-east-1.pooler.supabase.com
```

#### 4. Puerto en Uso

**Síntoma:**
```
bind: address already in use
```

**Solución:**
```bash
# Verificar qué está usando el puerto
netstat -tulpn | grep :4000

# Parar proceso o cambiar puerto en docker-compose.yml
ports:
  - "4001:4000"  # Cambiar puerto externo
```

#### 5. Error de Permisos

**Síntoma:**
```
permission denied
```

**Solución:**
```bash
# Verificar permisos del script start.sh
chmod +x start.sh

# Reconstruir imagen
docker build -t umesmicros/taller-repuestos .
```

### Logs y Monitoreo

#### Logs Detallados

```bash
# Logs con timestamps
docker-compose logs -f -t nodejs-app

# Logs de los últimos 100 líneas
docker logs --tail 100 taller-repuestos

# Logs desde una fecha específica
docker logs --since 2024-01-15T10:00:00 taller-repuestos
```

#### Monitoreo de Recursos

```bash
# Estadísticas en tiempo real
docker stats taller-repuestos

# Información detallada del sistema
docker system df

# Información del contenedor
docker inspect taller-repuestos
```

## Mejores Prácticas Implementadas

### Seguridad
- ✅ Usuario no-root
- ✅ Variables de entorno para configuración sensible
- ✅ Imagen base ligera (Alpine)
- ✅ Dependencias mínimas

### Performance
- ✅ Multi-stage build para optimización
- ✅ Cache de dependencias npm
- ✅ .dockerignore para reducir contexto
- ✅ Health checks para disponibilidad

### Mantenibilidad
- ✅ Documentación completa
- ✅ Variables de entorno centralizadas
- ✅ Scripts de inicio organizados
- ✅ Logs estructurados

## Información de la Imagen

**Repositorio:** `umesmicros/taller-repuestos`
**Tag:** `latest`
**Puerto expuesto:** `4000`
**Usuario:** `nodejs (1001:1001)`
**Punto de entrada:** `start.sh`

**Servicios integrados:**
- Sistema de gestión de taller
- Integración con sistema de pagos
- Gestión de inventario
- Sistema de devoluciones
- API RESTful completa 