export const querysEmpleados = {
    getEmpleados: "SELECT * FROM vistaGetEmpleados",
    getEmpleadoById: "SELECT * FROM getEmpleadoById($1)",
    postEmpleado: "SELECT postEmpleado($1, $2, $3, $4, $5, $6, $7)",
    putEmpleado: "SELECT putEmpleado($1, $2, $3, $4, $5, $6, $7, $8)",
    deleteEmpleado: "SELECT statusEmpleado($1)"
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