

export const querysMovimientoInventario = {
    getMovimientosInventario: "SELECT * FROM seleccionar_movimientosinventario()",
    getMovimientoInventario: "SELECT * FROM seleccionar_movimientoinventario($1)",
    postMovimientoInventario: "CALL insertar_movimientoinventario($1, $2, $3, $4, $5)",
    putMovimientoInventario: "CALL actualizar_movimientoinventario($6, $1, $2, $3, $4, $5)",
    deleteMovimientoInventario: "CALL eliminar_movimientoinventario($1)"
};

export const querysPrecioHistorial = {
    getPrecioHistorial: "SELECT * FROM seleccionar_preciohistorial()",
    getPrecioHistorialById: "SELECT * FROM seleccionar_preciohistorial_byid($1)",
    postPrecioHistorial: "CALL insertar_preciohistorial($1, $2, $3)",
    putPrecioHistorial: "CALL actualizar_preciohistorial($5, $1, $2, $3, $4)",
    deletePrecioHistorial: "CALL eliminar_preciohistorial($1)"
};

export const querysEmpleados = {
    getEmpleados: "SELECT * FROM empleado",
    postEmpleado: "INSERT INTO empleado (nombre, apellido, telefono, email, cargo) VALUES ($1, $2, $3, $4, $5)",
    putEmpleado: "UPDATE empleado SET nombre = $1, apellido = $2, telefono = $3, email = $4, cargo = $5 WHERE idempleado = $6",
    deleteEmpleado: "DELETE FROM empleado WHERE id = $1"
};

export const querysTipoServicio = {
    getTipoServicio: "SELECT * FROM vistaGetTipoServicio",
    getTipoServicioById: "SELECT * FROM getTipoServicioById($1)",
    postTipoServicio: "SELECT postTipoServicio($1, $2, $3)",
    putTipoServicio: "SELECT putTipoServicio($1, $2, $3, $4)",
    deleteTipoServicio: "SELECT statusTipoServicio($1)"
};

export const querysServicio = {
    getServicio: "SELECT * FROM vistaGetServicio",
    getServicioById: "SELECT * FROM getServicioById($1)",
    postServicio: "SELECT postServicio($1, $2, $3)",
    putServicio: "SELECT putServicio($1, $2, $3, $4)",
    deleteServicio: "SELECT statusServicio($1)"
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

export const querysCategorias = {
    getCategorias: "SELECT * FROM seleccionar_categorias()", // Cambio aquí
    getCategoria: "SELECT * FROM seleccionar_categoria($1)", // Cambio aquí
    postCategoria: "CALL insertar_categoria($1, $2, $3)",    // Cambio aquí
    putCategoria: "CALL actualizar_categoria($4, $1, $2, $3)", // Cambio aquí (orden ajustado)
    deleteCategoria: "CALL eliminar_categoria($1)"            // Cambio aquí
};

export const querysProductos = {
    getProductos: "SELECT * FROM seleccionar_productos()",
    getProducto: "SELECT * FROM seleccionar_producto($1)",
    postProducto: "CALL insertar_producto($1, $2, $3, $4, $5, $6)",
    putProducto: "CALL actualizar_producto($7, $1, $2, $3, $4, $5, $6)",
    deleteProducto: "CALL eliminar_producto($1)"
};

export const querysInventariosl = {
    getInventariosl: "SELECT * FROM seleccionar_inventariosl()",
    getInventariol: "SELECT * FROM seleccionar_inventariol($1)",
    postInventariol: "CALL insertar_inventariolote($1, $2, $3, $4)",
    putInventariol: "CALL actualizar_inventariolote($5, $1, $2, $3, $4)",
    deleteInventariol: "CALL eliminar_inventariolote($1)"
};

export const querysMovimientoInventario = {
    getMovimientosInventario: "SELECT * FROM seleccionar_movimientosinventario()",
    getMovimientoInventario: "SELECT * FROM seleccionar_movimientoinventario($1)",
    postMovimientoInventario: "CALL insertar_movimientoinventario($1, $2, $3, $4, $5)",
    putMovimientoInventario: "CALL actualizar_movimientoinventario($6, $1, $2, $3, $4, $5)",
    deleteMovimientoInventario: "CALL eliminar_movimientoinventario($1)"
};

export const querysPrecioHistorial = {
    getPrecioHistorial: "SELECT * FROM seleccionar_preciohistorial()",
    getPrecioHistorialById: "SELECT * FROM seleccionar_preciohistorial_byid($1)",
    postPrecioHistorial: "CALL insertar_preciohistorial($1, $2, $3)",
    putPrecioHistorial: "CALL actualizar_preciohistorial($5, $1, $2, $3, $4)",
    deletePrecioHistorial: "CALL eliminar_preciohistorial($1)"
};
  


export const querysDevolucion = {
    getDevolucion: "SELECT * FROM seleccionar_devoluciones()",
    getDevolucionById: "SELECT * FROM seleccionar_devolucion($1)",
    postDevolucion: "CALL insertar_devolucion($1, $2, $3, $4, $5)",
};