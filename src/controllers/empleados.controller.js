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

// --------------------- GET BY ID ---------------------
export const getEmpleadoById = async (req, res) => {
    try {
        const { idempleado } = req.params;

        // Obtenemos la conexion
        const empleado = await getConnection();

        // Ejecutamos la consulta
        const result = await empleado.query(querysEmpleados.getEmpleadoById, [idempleado]);

        // Liberamos la conexion
        empleado.release();

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- POST ---------------------
export const postEmpleado = async (req, res) => {
    try {
        let { estado } = req.body;
        const { nombre, apellido, telefono, email, cargo, salario } = req.body;

        // Validamos los datos
        if (!nombre || !apellido || !telefono || !email || !cargo || !salario ) {
            return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
        }

        if (!estado) {
            estado = "1";
        }

        // Obtenemos la conexion
        const empleado = await getConnection();

        // Ejecutamos la consulta
        await empleado.query(querysEmpleados.postEmpleado, [
            nombre,
            apellido,
            telefono,
            email,
            cargo,
            salario,
            estado
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
        let { estado } = req.body;
        const { idempleado } = req.params;
        const { nombre, apellido, telefono, email, cargo, salario } = req.body;

        // Validamos los datos
        if (!nombre || !apellido || !telefono || !email || !cargo || !salario ) {
            return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
        }

        
        if (!estado) {
            estado = "1";
        }

        // Obtenemos la conexion
        const empleado = await getConnection();

        // Ejecutamos la consulta
        await empleado.query(querysEmpleados.putEmpleado, [
            idempleado,
            nombre,
            apellido,
            telefono,
            email,
            cargo,
            salario,
            estado
        ]);

        // Liberamos la conexion
        empleado.release();

        res.json({ msg: "Employee updated successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// --------------------- DELETE ---------------------
export const deleteEmpleado = async (req, res) => {
    try {
        const { idempleado } = req.params;

        // Obtenemos la conexion
        const empleado = await getConnection();

        // Ejecutamos la consulta
        await empleado.query(querysEmpleados.deleteEmpleado, [idempleado]);

        // Liberamos la conexion
        empleado.release();

        res.json({ msg: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};