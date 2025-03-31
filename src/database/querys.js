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
    getClientes: 'SELECT * FROM cliente ORDER BY idcliente',
    getClienteById: 'SELECT * FROM cliente WHERE idcliente = $1',
    createCliente: 'INSERT INTO cliente (nombre, apellido, nit, telefono, email, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
    updateCliente: 'UPDATE cliente SET nombre = $1, apellido = $2, nit = $3, telefono = $4, email = $5, status = $6, updated_at = NOW() WHERE idcliente = $7 RETURNING *',
    deleteCliente: 'UPDATE cliente SET status = 0, updated_at = NOW() WHERE idcliente = $1'
};


export const querysVehiculos = {
    getVehiculos: 'SELECT * FROM vehiculo ORDER BY idvehiculo',
    getVehiculoById: 'SELECT * FROM vehiculo WHERE idvehiculo = $1',
    createVehiculo: 'INSERT INTO vehiculo (placa, marca, modelo, anio, tipovehiculo, idcliente, status, created_at, updated_at) VALUES ($1, $2, $3, $4::INTEGER, $5, $6, $7, NOW(), NOW()) RETURNING *',
    updateVehiculo: 'UPDATE vehiculo SET placa = $1, marca = $2, modelo = $3, anio = $4, tipovehiculo = $5, idcliente = $6, status = $7, updated_at = NOW() WHERE idvehiculo = $8 RETURNING *',
    deleteVehiculo: 'UPDATE vehiculo SET status = 0, updated_at = NOW() WHERE idvehiculo = $1'
};
