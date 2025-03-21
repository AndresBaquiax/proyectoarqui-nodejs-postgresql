import res from 'express/lib/response.js';
import { pool } from '../database/connection.js';
import { querysPrecioH } from '../database/querys';

const getPreciosH = async (req, res) => {
    try {
        const result = await pool.query(querysPrecioH.getPrecioH);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} ;

const getPreciosHById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(querysPrecioH.getPrecioHById, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Historial de precio no encontrado" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createPrecioH = async (req, res) => {
    const { precioanterior, precionuevo, fechahistoria, idProducto } = req.body;
    try {
        const result = await pool.query(querysPrecioH.createPrecioH, [precioanterior, precionuevo, fechahistoria, idProducto]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePrecioH = async (req, res) => {
    const { id } = req.params;
    const { precioanterior, precionuevo, fechahistoria, idProducto } = req.body;
    try {
        const result = await pool.query(querysPrecioH.updatePrecioH, [precioanterior, precionuevo, fechahistoria, idProducto, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "El movimiento no encontrado" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deletePrecioH = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(querysPrecioH.deletePrecioH, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "historial de precio no encontrado o ya inactivo" });
        }
        res.status(200).json({ message: "historial de precio eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    getPreciosH,
    getPreciosHById,
    createPrecioH,
    updatePrecioH,
    deletePrecioH
};