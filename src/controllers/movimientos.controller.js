import { getConnection, querysMovimientoInventario } from "../database/index.js";

// --------------------- GET ---------------------
export const getMovimientosInventario = async (req, res) => {
    try {
        // Obtenemos la conexion
        const connection = await getConnection();
        const result = await connection.query(querysMovimientoInventario.getMovimientosInventario);
        
        // Liberamos la conexion
        connection.release();
        
        res.json(result.rows);
    } catch (error) {
        console.error("Error in getMovimientosInventario:", error);
        res.status(500).send("An error occurred while retrieving inventory movements.");
    }
};

// --------------------- GET BY ID ---------------------
export const getMovimientoInventarioById = async (req, res) => {
    try {
        const { idmovimiento } = req.params;

        // Obtenemos la conexion
        const connection = await getConnection();

        // Ejecutamos la consulta
        const result = await connection.query(querysMovimientoInventario.getMovimientoInventario, [idmovimiento]);

        // Liberamos la conexion
        connection.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: "Inventory movement not found." });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error in getMovimientoInventarioById:", error);
        res.status(500).send("An error occurred while retrieving the inventory movement.");
    }
};

// --------------------- POST ---------------------
export const postMovimientoInventario = async (req, res) => {
    try {
        const { idlote, idproducto, cantidad, tipo, descripcion } = req.body;

        // Validamos los datos
        const errors = [];
        if (!idlote) errors.push("idlote is required.");
        if (!idproducto) errors.push("idproducto is required.");
        if (!cantidad && cantidad !== 0) errors.push("cantidad is required.");
        if (cantidad < 0) errors.push("cantidad cannot be negative.");
        if (!tipo || !["entrada", "salida"].includes(tipo)) errors.push("tipo must be either 'entrada' or 'salida'.");
        if (!descripcion) errors.push("descripcion is required.");

        if (errors.length > 0) {
            return res.status(400).json({ msg: "Validation errors.", errors });
        }

        // Obtenemos la conexion
        const connection = await getConnection();

        // Ejecutamos la consulta
        await connection.query(querysMovimientoInventario.postMovimientoInventario, [
            idlote,
            idproducto,
            cantidad,
            tipo,
            descripcion
        ]);

        // Liberamos la conexion
        connection.release();

        res.json({ msg: "Inventory movement added successfully." });
    } catch (error) {
        console.error("Error in postMovimientoInventario:", error);
        res.status(500).send("An error occurred while adding the inventory movement.");
    }
};

// --------------------- PUT ---------------------
export const putMovimientoInventario = async (req, res) => {
    try {
        const { idmovimiento } = req.params;
        const { idlote, idproducto, cantidad, tipo, descripcion } = req.body;

        // Validamos los datos
        if (!idlote || !idproducto || cantidad === undefined || !tipo || !descripcion) {
            return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
        }

        // Obtenemos la conexion
        const connection = await getConnection();

        // Ejecutamos la consulta
        await connection.query(querysMovimientoInventario.putMovimientoInventario, [
            idlote,
            idproducto,
            cantidad,
            tipo,
            descripcion,
            idmovimiento
        ]);

        // Liberamos la conexion
        connection.release();

        res.json({ msg: "Inventory movement updated successfully." });
    } catch (error) {
        console.error("Error in putMovimientoInventario:", error);
        res.status(500).send("An error occurred while updating the inventory movement.");
    }
};

// --------------------- DELETE ---------------------
export const deleteMovimientoInventario = async (req, res) => {
    try {
        const { idmovimiento } = req.params;

        // Obtenemos la conexion
        const connection = await getConnection();

        // Ejecutamos la consulta
        await connection.query(querysMovimientoInventario.deleteMovimientoInventario, [idmovimiento]);

        // Liberamos la conexion
        connection.release();

        res.json({ msg: "Inventory movement successfully removed." });
    } catch (error) {
        console.error("Error in deleteMovimientoInventario:", error);
        res.status(500).send("An error occurred while deleting the inventory movement.");
    }
};

