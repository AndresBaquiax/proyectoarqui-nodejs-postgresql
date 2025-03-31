import { getConnection, querysServicio } from "../database/index.js";

// --------------------- GET ---------------------
export const getServicio = async (req, res) => {
    try {
        // Obtenemos la conexion
        const connection = await getConnection();
        const result = await connection.query(querysServicio.getServicio);
        // Liberamos la conexion
        connection.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- GET BY ID ---------------------
export const getServicioById = async (req, res) => {
    try {
        const { idservicio } = req.params;

        // Obtenemos la conexion
        const servicio = await getConnection();

        // Ejecutamos la consulta
        const result = await servicio.query(querysServicio.getServicioById, [idservicio]);

        // Liberamos la conexion
        servicio.release();

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- POST ---------------------
export const postServicio = async (req, res) => {
    try {
        const { tipovehiculo, idtiposervicio, idempleado } = req.body;

        // Validamos los datos
        if ( !tipovehiculo || !idtiposervicio || !idempleado ) {
            return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
        }

        // Obtenemos la conexion
        const servicio = await getConnection();

        // Ejecutamos la consulta
        await servicio.query(querysServicio.postServicio, [
            tipovehiculo,
            idtiposervicio,
            idempleado
        ]);

        // Liberamos la conexion
        servicio.release();

        res.json({ msg: "Service added successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- PUT ---------------------
export const putServicio = async (req, res) => {
    try {
        const { idservicio } = req.params;
        const { tipovehiculo, idtiposervicio, idempleado } = req.body;

        // Validamos los datos
        if ( !tipovehiculo || !idtiposervicio || !idempleado ) {
            return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
        }

        // Obtenemos la conexion
        const servicio = await getConnection();

        // Ejecutamos la consulta
        await servicio.query(querysServicio.putServicio, [
            idservicio,
            tipovehiculo,
            idtiposervicio,
            idempleado
        ]);

        // Liberamos la conexion
        servicio.release();

        res.json({ msg: "Service updated successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- DELETE ---------------------
export const deleteServicio = async (req, res) => {
    try {
        const { idservicio } = req.params;

        // Obtenemos la conexion
        const servicio = await getConnection();

        // Ejecutamos la consulta
        await servicio.query(querysServicio.deleteServicio, [
            idservicio
        ]);

        // Liberamos la conexion
        servicio.release();

        res.json({ msg: "Service deleted successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
}