
export const querysEmpleados = {
    getEmpleados: "SELECT * FROM empleado",
    postEmpleado: "INSERT INTO empleado (nombre, apellido, telefono, email, cargo) VALUES ($1, $2, $3, $4, $5)",
    putEmpleado: "UPDATE empleado SET nombre = $1, apellido = $2, telefono = $3, email = $4, cargo = $5 WHERE idempleado = $6",
    deleteEmpleado: "DELETE FROM empleado WHERE id = $1"
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
  
