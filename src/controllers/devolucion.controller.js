import { getConnection, querysDevolucion} from "../database/index.js";

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