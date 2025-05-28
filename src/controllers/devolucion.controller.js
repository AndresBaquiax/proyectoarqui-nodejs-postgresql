import { getConnection, querysDevolucion} from "../database/index.js";
import { 
    crearDevolucion, 
    obtenerDevoluciones, 
    obtenerDevolucion 
} from '../services/pagoService.js';

// --------------------- GET ALL ---------------------
export const getDevolucion = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(querysDevolucion.getDevolucion);
    connection.release();
    res.json(result.rows);
  } catch (error) {
    console.error("Error in getDevolucion:", error);
    res.status(500).send("An error occurred while retrieving devolution.");
  }
};

// --------------------- GET BY ID ---------------------
export const getDevolucionById = async (req, res) => {
  try {
    const { iddevolucion } = req.params;
    const connection = await getConnection();
    const result = await connection.query(querysDevolucion.getDevolucionById, [iddevolucion]);
    connection.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Devolution not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error in getDevolutionById:", error);
    res.status(500).send("An error occurred while retrieving the devolution.");
  }
};

// --------------------- POST ---------------------
export const postDevolucion = async (req, res) => {
  try {
    const { iddevolucion, fecharealizada, motivo, monto, idventa } = req.body;

    const errors = [];
    if (!iddevolucion) errors.push("iddevolution is required.");
    if (!fecharealizada) errors.push("date made is required.");
    if (!motivo) errors.push("motive is required.");
    if (monto < 0) errors.push("Price cannot be negative or null.");
    if (!idventa) errors.push("idventa is required.");


    if (errors.length > 0) {
      return res.status(400).json({ msg: "Validation errors.", errors });
    }
    
    const connection = await getConnection();
    await connection.query(querysDevolucion.postDevolucion, [
      iddevolucion,
      fecharealizada,
      motivo,
      monto,
      idventa
    ]);

    connection.release();
    res.json({ msg: "Devolution added successfully." });
  } catch (error) {
    console.error("Error in postDevolution:", error);
    res.status(500).send("An error occurred while adding the devolution to the system.");
  }
};

// --------------------- CREAR DEVOLUCIÓN ---------------------
export const crearDevolucionController = async (req, res) => {
    try {
        const { NoTransaccion, Monto, Descripcion } = req.body;

        // Validaciones básicas
        if (!NoTransaccion || !Monto || !Descripcion) {
            return res.status(400).json({ 
                error: "Faltan datos requeridos: NoTransaccion, Monto, Descripcion" 
            });
        }

        // Validar que el monto sea positivo
        if (parseFloat(Monto) <= 0) {
            return res.status(400).json({ 
                error: "El monto debe ser mayor a 0" 
            });
        }

        // Transformar datos al formato requerido
        const datosDevolucion = {
            NoTransaccion: parseInt(NoTransaccion),
            Monto: parseFloat(Monto),
            Descripcion: Descripcion.toString()
        };

        // Crear devolución en el sistema externo
        const resultado = await crearDevolucion(datosDevolucion);

        res.status(201).json({
            message: "Devolución creada exitosamente",
            devolucion: resultado
        });

    } catch (error) {
        console.error('Error en crearDevolucionController:', error);
        res.status(500).json({ error: error.message });
    }
};

// --------------------- OBTENER DEVOLUCIONES ---------------------
export const obtenerDevolucionesController = async (req, res) => {
    try {
        const { fechaInicio, fechaFinal } = req.body || {};

        // Crear filtro si se proporcionan fechas
        const filtro = {};
        if (fechaInicio) {
            filtro.fechaInicio = fechaInicio;
        }
        if (fechaFinal) {
            filtro.fechaFinal = fechaFinal;
        }

        // Obtener devoluciones del sistema externo
        const devoluciones = await obtenerDevoluciones(filtro);

        res.status(200).json({
            message: "Devoluciones obtenidas exitosamente",
            devoluciones: devoluciones,
            total: devoluciones.length
        });

    } catch (error) {
        console.error('Error en obtenerDevolucionesController:', error);
        res.status(500).json({ error: error.message });
    }
};

// --------------------- OBTENER DEVOLUCIÓN POR NÚMERO ---------------------
export const obtenerDevolucionController = async (req, res) => {
    try {
        const { noDevolucion } = req.params;

        if (!noDevolucion) {
            return res.status(400).json({ 
                error: "Número de devolución es requerido" 
            });
        }

        // Validar que sea un número
        const numeroDevolucion = parseInt(noDevolucion);
        if (isNaN(numeroDevolucion)) {
            return res.status(400).json({ 
                error: "El número de devolución debe ser un número válido" 
            });
        }

        // Obtener devolución del sistema externo
        const devolucion = await obtenerDevolucion(numeroDevolucion);

        res.status(200).json({
            message: "Devolución obtenida exitosamente",
            devolucion: devolucion
        });

    } catch (error) {
        console.error('Error en obtenerDevolucionController:', error);
        
        if (error.message.includes('404')) {
            res.status(404).json({ error: "Devolución no encontrada" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};