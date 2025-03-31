import { pool } from '../database/connection.js';
import { querysVentas } from '../database/querys.js';

const getVentas = async (req, res) => {
    try {
        const result = await pool.query(querysVentas.getVentas);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getVentaById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(querysVentas.getVentaById, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createVenta = async (req, res) => {
    const { tipoventa, fechaventa, totalventa, idcliente, status } = req.body;
    try {
      const result = await pool.query(querysVentas.createVenta, [
        tipoventa,
        fechaventa,
        totalventa,
        idcliente,
        status
      ]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const updateVenta = async (req, res) => {
    const { id } = req.params;
    const { tipoventa, fechaventa, totalventa, idcliente, status } = req.body;
    try {
        const result = await pool.query(querysVentas.updateVenta, [
            tipoventa,     
            fechaventa,    
            totalventa,   
            idcliente,     
            status,        
            id             
        ]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const deleteVenta = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(querysVentas.deleteVenta, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        res.status(200).json({ message: "Venta eliminada correctamente (borrado lógico)" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    getVentas,
    getVentaById,
    createVenta,
    updateVenta,
    deleteVenta
};
