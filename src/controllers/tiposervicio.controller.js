import { getConnection, querysTipoServicio } from "../database/index.js";

// --------------------- GET ---------------------
export const getTipoServicio = async (req, res) => {
    try {
        // Obtenemos la conexion
        const connection = await getConnection();
        const result = await connection.query(querysTipoServicio.getTipoServicio);
        // Liberamos la conexion
        connection.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- GET BY ID ---------------------
export const getTipoServicioById = async (req, res) => {
    try {
        const { idtiposervicio } = req.params;

        // Obtenemos la conexion
        const tipo = await getConnection();

        // Ejecutamos la consulta
        const result = await tipo.query(querysTipoServicio.getTipoServicioById, [idtiposervicio]);

        // Liberamos la conexion
        tipo.release();

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- POST ---------------------
export const postTipoServicio = async (req, res) => {
    try {
        const { descripcion, costo, tiposervicio } = req.body;

        // Validamos los datos
        if ( !descripcion || !costo || !tiposervicio ) {
            return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
        }

        // Obtenemos la conexion
        const tipo = await getConnection();

        // Ejecutamos la consulta
        await tipo.query(querysTipoServicio.postTipoServicio, [
            descripcion,
            costo,
            tiposervicio
        ]);

        // Liberamos la conexion
        tipo.release();

        res.json({ msg: "Service type added successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- PUT ---------------------
export const putTipoServicio = async (req, res) => {
    try {
        const { idtiposervicio } = req.params;
        const { descripcion, costo, tiposervicio } = req.body;

        // Validamos los datos
        if ( !descripcion || !costo || !tiposervicio ) {
            return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
        }

        // Obtenemos la conexion
        const tipo = await getConnection();

        // Ejecutamos la consulta
        await tipo.query(querysTipoServicio.putTipoServicio, [
            idtiposervicio,
            descripcion,
            costo,
            tiposervicio
        ]);

        // Liberamos la conexion
        tipo.release();

        res.json({ msg: "Service type updated successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- DELETE ---------------------
export const deleteTipoServicio = async (req, res) => {
    try {
        const { idtiposervicio } = req.params;

        // Obtenemos la conexion
        const tipo = await getConnection();

        // Ejecutamos la consulta
        await tipo.query(querysTipoServicio.deleteTipoServicio, [
            idtiposervicio
        ]);

        // Liberamos la conexion
        tipo.release();

        res.json({ msg: "Service type deleted successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
}