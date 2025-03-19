import { pool } from '../database/connection.js';
import { querysVehiculos } from '../database/querys.js';

const getVehiculos = async (req, res) => {
    try {
        const result = await pool.query(querysVehiculos.getVehiculos);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getVehiculoById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(querysVehiculos.getVehiculoById, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createVehiculo = async (req, res) => {
    let { placa, marca, modelo, anio, tipovehiculo, idcliente, status } = req.body;

    try {
        anio = parseInt(anio); // Convertir anio a número entero
        const result = await pool.query(querysVehiculos.createVehiculo, [placa, marca, modelo, anio, tipovehiculo, idcliente, status]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateVehiculo = async (req, res) => {
    const { id } = req.params;
    const { placa, marca, modelo, anio, tipovehiculo, idcliente, status } = req.body;
    try {
        const result = await pool.query(querysVehiculos.updateVehiculo, [placa, marca, modelo, anio, tipovehiculo, idcliente, status, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteVehiculo = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(querysVehiculos.deleteVehiculo, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Vehículo no encontrado o ya eliminado" });
        }
        res.status(200).json({ message: "Vehículo eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { getVehiculos, getVehiculoById, createVehiculo, updateVehiculo, deleteVehiculo };
