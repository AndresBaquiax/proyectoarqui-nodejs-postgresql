#!/bin/sh

# Configurar DNS para mejor resolución de nombres
echo "nameserver 8.8.8.8" > /etc/resolv.conf
echo "nameserver 8.8.4.4" >> /etc/resolv.conf

# Ejecutar la aplicación
exec node src/index.js 