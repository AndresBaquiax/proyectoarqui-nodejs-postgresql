import { getConnection, querysCategorias } from "../database/index.js";

// --------------------- GET ---------------------
export const getCategorias = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(querysCategorias.getCategorias);
        connection.release();
        res.json(result.rows);
    } catch (error) {
        console.error("Error in getCategorias:", error);
        res.status(500).send("An error occurred while retrieving categories.");
    }
};

// --------------------- GET BY ID ---------------------
export const getCategoria = async (req, res) => {
    try {
        const { idcategoria } = req.params;
        const connection = await getConnection();
        const result = await connection.query(querysCategorias.getCategoria, [idcategoria]);
        connection.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: "Category not found." });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error in getCategoria:", error);
        res.status(500).send("An error occurred while retrieving the category.");
    }
};

// --------------------- POST ---------------------
export const postCategoria = async (req, res) => {
    try {
        const { nombre, descripcion, status } = req.body;

        if (!nombre || !descripcion || !status) {
            return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
        }

        const connection = await getConnection();
        await connection.query(querysCategorias.postCategoria, [nombre, descripcion, status]);
        connection.release();

        res.json({ msg: "Category added successfully." });
    } catch (error) {
        console.error("Error in postCategoria:", error);
        res.status(500).send("An error occurred while adding the category.");
    }
};

// --------------------- PUT ---------------------
export const putCategoria = async (req, res) => {
    try {
        const { idcategoria } = req.params;
        const { nombre, descripcion, status } = req.body;

        if (!nombre || !descripcion || !status) {
            return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
        }

        const connection = await getConnection();
        await connection.query(querysCategorias.putCategoria, [nombre, descripcion, status, idcategoria]);
        connection.release();

        res.json({ msg: "Category updated successfully." });
    } catch (error) {
        console.error("Error in putCategoria:", error);
        res.status(500).send("An error occurred while updating the category.");
    }
};

// --------------------- DELETE ---------------------
export const deleteCategoria = async (req, res) => {
    try {
        const { idcategoria } = req.params;
        const connection = await getConnection();
        await connection.query(querysCategorias.deleteCategoria, [idcategoria]);
        connection.release();
        res.json({ msg: "Category successfully removed." });
    } catch (error) {
        console.error("Error in deleteCategoria:", error);
        res.status(500).send("An error occurred while removing the category.");
    }
};