import { pool } from '../database/connection.js';
import { querysClientes } from '../database/querys.js';

const getClientes = async (req, res) => {
    try {
        const result = await pool.query(querysClientes.getClientes);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getClienteById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(querysClientes.getClienteById, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createCliente = async (req, res) => {
    const { nombre, apellido, nit, telefono, email, status } = req.body;
    try {
        const result = await pool.query(querysClientes.createCliente, [nombre, apellido, nit, telefono, email, status]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, nit, telefono, email, status } = req.body;
    try {
        const result = await pool.query(querysClientes.updateCliente, [nombre, apellido, nit, telefono, email, status, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(querysClientes.deleteCliente, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Cliente no encontrado o ya inactivo" });
        }
        res.status(200).json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export {
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente
};
