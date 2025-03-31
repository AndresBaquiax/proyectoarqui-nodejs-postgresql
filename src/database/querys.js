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