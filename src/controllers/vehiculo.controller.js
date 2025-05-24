import { pool } from '../database/connection.js';
import { querysVehiculos } from '../database/querys.js';

// --------------------- GET ---------------------
const getVehiculos = async (req, res) => {
    try {
        const result = await pool.query(querysVehiculos.getVehiculos);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --------------------- GET BY ID ---------------------
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

// --------------------- POST ---------------------
const createVehiculo = async (req, res) => {
    const { placa, marca, modelo, anio, tipovehiculo, idcliente, status } = req.body;

    try {
        const anioInt = parseInt(anio); 
        const result = await pool.query(querysVehiculos.createVehiculo, [placa, marca, modelo, anioInt, tipovehiculo, idcliente, status]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --------------------- PUT ---------------------
const updateVehiculo = async (req, res) => {
    const { id } = req.params;
    const { placa, marca, modelo, anio, tipovehiculo, idcliente, status } = req.body;
    try {
        const anioInt = parseInt(anio);
        const result = await pool.query(querysVehiculos.updateVehiculo, [id, placa, marca, modelo, anioInt, tipovehiculo, idcliente, status]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --------------------- DELETE ---------------------
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
