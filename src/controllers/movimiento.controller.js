import res from 'express/lib/response.js';
import { pool } from '../database/connection.js';
import { querysMovimientos } from '../database/querys';

const getMovimientos = async (req, res) => {
    try {
        const result = await pool.query(querysMovimientos.getMovimientos);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} ;

const getMovimientoById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(querysMovimientos.getMovimientosById, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Movimiento no encontrado" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createMovimiento = async (req, res) => {
    const { fecha, cantidad, descripcion, tipoMovimiento, idProducto } = req.body;
    try {
        const result = await pool.query(querysMovimientos.createMovimiento, [fecha, cantidad, descripcion, tipoMovimiento, idProducto]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMovimiento = async (req, res) => {
    const { id } = req.params;
    const { fecha, cantidad, descripcion, tipoMovimiento, idProducto } = req.body;
    try {
        const result = await pool.query(querysMovimientos.updateMovimiento, [fecha, cantidad, descripcion, tipoMovimiento, idProducto, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "El movimiento no encontrado" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteMovimiento = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(querysMovimientos.deleteMovimiento, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Movimiento no encontrado o ya inactivo" });
        }
        res.status(200).json({ message: "Movimiento eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    getMovimientos,
    getMovimientoById,
    createMovimiento,
    updateMovimiento,
    deleteMovimiento
};

