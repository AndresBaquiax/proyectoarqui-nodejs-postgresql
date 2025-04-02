
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

export const querysDevolucion = {
    getDevolucion: "SELECT * FROM seleccionar_devoluciones()",
    getDevolucionById: "SELECT * FROM seleccionar_devolucion($1)",
    postDevolucion: "CALL insertar_devolucion($1, $2, $3, $4, $5)",
};