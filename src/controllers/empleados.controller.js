import { getConnection, querysEmpleados } from "../database/index.js";

// --------------------- GET ---------------------
export const getEmpleados = async (req, res) => {
    try {
        // Obtenemos la conexion
        const connection = await getConnection();
        const result = await connection.query(querysEmpleados.getEmpleados);
        // Liberamos la conexion
        connection.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- POST ---------------------
export const prueba = async (req, res) => {
    try {
        res.json({
            message: "Conexión exitosa"
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- POST ---------------------
export const postEmpleado = async (req, res) => {
    try {
        const { nombre, apellido, telefono, email, cargo } = req.body;

        // Validamos los datos
        if (!nombre || !apellido || !telefono || !email || !cargo) {
            return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
        }

        // Obtenemos la conexion
        const empleado = await getConnection();

        // Ejecutamos la consulta
        await empleado.query(querysEmpleados.postEmpleado, [
            nombre,
            apellido,
            telefono,
            email,
            cargo
        ]);

        // Liberamos la conexion
        empleado.release();

        res.json({ msg: "Employee added successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- PUT ---------------------
export const putEmpleado = async (req, res) => {
    try {
        const { idempleado } = req.params;
        const { nombre, apellido, telefono, email, cargo } = req.body;

        // Validamos los datos
        if (!nombre || !apellido || !telefono || !email || !cargo) {
            return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
        }

        // Obtenemos la conexion
        const empleado = await getConnection();

        // Ejecutamos la consulta
        await empleado.query(querysEmpleados.putEmpleado, [
            nombre,
            apellido,
            telefono,
            email,
            cargo,
            idempleado
        ]);

        // Liberamos la conexion
        empleado.release();

        res.json({ msg: "Employee updated successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};