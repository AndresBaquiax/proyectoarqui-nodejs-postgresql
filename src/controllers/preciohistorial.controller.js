import { getConnection, querysPrecioHistorial } from "../database/index.js";

// --------------------- GET ALL ---------------------
export const getPrecioHistorial = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(querysPrecioHistorial.getPrecioHistorial);
    connection.release();
    res.json(result.rows);
  } catch (error) {
    console.error("Error in getPrecioHistorial:", error);
    res.status(500).send("An error occurred while retrieving price history.");
  }
};

// --------------------- GET BY ID ---------------------
export const getPrecioHistorialById = async (req, res) => {
  try {
    const { idhistorial } = req.params;
    const connection = await getConnection();
    const result = await connection.query(querysPrecioHistorial.getPrecioHistorialById, [idhistorial]);
    connection.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Price history record not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error in getPrecioHistorialById:", error);
    res.status(500).send("An error occurred while retrieving the price history record.");
  }
};

// --------------------- POST ---------------------
export const postPrecioHistorial = async (req, res) => {
  try {
    const { idproducto, precioanterior, precionuevo } = req.body;

    const errors = [];
    if (!idproducto) errors.push("idproducto is required.");
    if (!precioanterior) errors.push("precioanterior is required.");
    if (!precionuevo) errors.push("precionuevo is required.");
    if (precioanterior < 0 || precionuevo < 0) errors.push("Prices cannot be negative.");

    if (errors.length > 0) {
      return res.status(400).json({ msg: "Validation errors.", errors });
    }

    //const fechacambio = new Date();

    const connection = await getConnection();
    await connection.query(querysPrecioHistorial.postPrecioHistorial, [
      idproducto,
      precioanterior,
      precionuevo
      //fechacambio //fechacambio
    ]);

    connection.release();
    res.json({ msg: "Price history record added successfully." });
  } catch (error) {
    console.error("Error in postPrecioHistorial:", error);
    res.status(500).send("An error occurred while adding the price history record.");
  }
};

// --------------------- PUT ---------------------
export const putPrecioHistorial = async (req, res) => {
  try {
    const { idhistorial } = req.params;
    const { idproducto, precioanterior, precionuevo } = req.body;

    if (!idproducto || !precioanterior || !precionuevo) {
      return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
    }

    const fechacambio = new Date(); //actualiza fecha de cambio

    const connection = await getConnection();
    await connection.query(querysPrecioHistorial.putPrecioHistorial, [
      idproducto,
      precioanterior,
      precionuevo,
      fechacambio, // fechacambio
      idhistorial
    ]);

    connection.release();
    res.json({ msg: "Price history record updated successfully." });
  } catch (error) {
    console.error("Error in putPrecioHistorial:", error);
    res.status(500).send("An error occurred while updating the price history record.");
  }
};

// --------------------- DELETE ---------------------
export const deletePrecioHistorial = async (req, res) => {
  try {
    const { idhistorial } = req.params;

    const connection = await getConnection();
    await connection.query(querysPrecioHistorial.deletePrecioHistorial, [idhistorial]);
    connection.release();

    res.json({ msg: "Price history record successfully removed." });
  } catch (error) {
    console.error("Error in deletePrecioHistorial:", error);
    res.status(500).send("An error occurred while deleting the price history record.");
  }
};
