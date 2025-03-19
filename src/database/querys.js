export const querysEmpleados = {
    getEmpleados: "SELECT * FROM empleado",
    postEmpleado: "INSERT INTO empleado (nombre, apellido, telefono, email, cargo) VALUES ($1, $2, $3, $4, $5)",
    putEmpleado: "UPDATE empleado SET nombre = $1, apellido = $2, telefono = $3, email = $4, cargo = $5 WHERE idempleado = $6",
    deleteEmpleado: "DELETE FROM empleado WHERE id = $1"
};

export const querysClientes = {
    getClientes: 'SELECT * FROM cliente ORDER BY idcliente',
    getClienteById: 'SELECT * FROM cliente WHERE idcliente = $1',
    createCliente: 'INSERT INTO cliente (nombre, apellido, nit, telefono, email, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
    updateCliente: 'UPDATE cliente SET nombre = $1, apellido = $2, nit = $3, telefono = $4, email = $5, status = $6, updated_at = NOW() WHERE idcliente = $7 RETURNING *',
    deleteCliente: 'UPDATE cliente SET status = 0, updated_at = NOW() WHERE idcliente = $1'
};
