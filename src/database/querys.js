export const querysEmpleados = {
    getEmpleados: "SELECT * FROM empleado",
    postEmpleado: "INSERT INTO empleado (nombre, apellido, telefono, email, cargo) VALUES ($1, $2, $3, $4, $5)",
    putEmpleado: "UPDATE empleado SET nombre = $1, apellido = $2, telefono = $3, email = $4, cargo = $5 WHERE idempleado = $6",
    deleteEmpleado: "DELETE FROM empleado WHERE id = $1"
};

export const querysClientes = {
    getClientes: 'SELECT * FROM vista_clientes',
    getClienteById: 'SELECT * FROM obtener_cliente_por_id($1)',
    createCliente: 'SELECT crear_cliente($1, $2, $3, $4, $5, $6)',
    updateCliente: 'SELECT actualizar_cliente($1, $2, $3, $4, $5, $6, $7)',
    deleteCliente: 'SELECT eliminar_cliente($1)'
};

export const querysVehiculos = {
    getVehiculos: 'SELECT * FROM vista_vehiculos',
    getVehiculoById: 'SELECT * FROM obtener_vehiculo_por_id($1)',
    createVehiculo: 'SELECT crear_vehiculo($1, $2, $3, $4, $5, $6, $7)',
    updateVehiculo: 'SELECT actualizar_vehiculo($1, $2, $3, $4, $5, $6, $7, $8)',
    deleteVehiculo: 'SELECT eliminar_vehiculo($1)'
};

export const querysVentas = {
    getVentas: 'SELECT * FROM vista_ventas',
    getVentaById: 'SELECT * FROM obtener_venta_por_id($1)',
    createVenta: 'SELECT crear_venta($1, $2, $3, $4, $5)',
    updateVenta: 'SELECT actualizar_venta($1, $2, $3, $4, $5, $6)',
    deleteVenta: 'SELECT eliminar_venta($1)'
};  