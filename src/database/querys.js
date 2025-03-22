import { createMovimiento, deleteMovimiento, getMovimientos, updateMovimiento } from "../controllers/movimiento.controller";
import { createPrecioH, deletePrecioH, getPrecioHById, getPreciosH, updatePrecioH } from "../controllers/precioH.controller";

export const querysEmpleados = {
    getEmpleados: "SELECT * FROM empleado",
    postEmpleado: "INSERT INTO empleado (nombre, apellido, telefono, email, cargo) VALUES ($1, $2, $3, $4, $5)",
    putEmpleado: "UPDATE empleado SET nombre = $1, apellido = $2, telefono = $3, email = $4, cargo = $5 WHERE idempleado = $6",
    deleteEmpleado: "DELETE FROM empleado WHERE id = $1"
};

export const querysMovimientos = {
    getMovimientos: 'SELECT * FROM movimiento ORDER BY idmovimiento',
    getMovimientoById: 'SELECT * FROM movimiento WHERE idmovimiento = $1',
    createMovimiento: 'INSERT INTO movimiento (fechamovimiento, cantidad, descripcion, tipomovimiento, idproducto, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
    updateMovimiento: 'UPDATE movimiento SET fechamovimiento = $1, cantidad = $2, descripcion = $3, tipomovimiento = $4, idproducto = $5, updated_at = NOW() WHERE idmovimiento = $6 RETURNING *',
    deleteMovimiento: 'Delete FROM movimiento WHERE idmovimiento = $1'
    //deleteMovimiento: 'UPDATE movimiento SET status = 0, updated_at = NOW() WHERE idmovimiento = $1'
};

export const querysPrecioH = {
    getPreciosH: 'SELECT * FROM preciohistorial ORDER BY idhistorial',
    getPrecioHById: 'SELECT * FROM preciohistorial WHERE idhistorial = $1',
    createPrecioH: 'INSERT INTO preciohistorial (precioanterior, precionuevo, fechahistorial, idproducto, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
    updatePrecioH: 'UPDATE preciohistorial SET precioanterior = $1, precionuevo = $2, fechahistorial = $3, idproducto = $4, updated_at = NOW() WHERE idhistorial = $5 RETURNING *',
    deletePrecioH: 'Delete FROM preciohistorial WHERE idhistorial = $1'
    //deletePrecioH: 'UPDATE preciohistorial SET status = 0, updated_at = NOW() WHERE idhistorial = $1'
};