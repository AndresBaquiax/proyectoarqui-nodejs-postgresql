import { getConnection, querysInventariosl } from "../database/index.js";

// --------------------- GET ALL ---------------------
export const getInventariosl = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(querysInventariosl.getInventariosl);
    connection.release();
    res.json(result.rows);
  } catch (error) {
    console.error("Error in getInventariosl:", error);
    res.status(500).send("An error occurred while retrieving inventory lots.");
  }
};

// --------------------- GET BY ID ---------------------
export const getInventarioslById = async (req, res) => {
  try {
    const { idlote } = req.params;
    const connection = await getConnection();
    const result = await connection.query(querysInventariosl.getInventariol, [idlote]);
    connection.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Inventory lot not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error in getInventarioslById:", error);
    res.status(500).send("An error occurred while retrieving the inventory lot.");
  }
};

// --------------------- POST ---------------------
export const postInventariol = async (req, res) => {
  try {
    const { idproducto, cantidad, fechaadquisicion, activo } = req.body;

    const errors = [];
    if (!idproducto) errors.push("idproducto is required.");
    if (!cantidad && cantidad !== 0) errors.push("cantidad is required.");
    if (cantidad < 0) errors.push("cantidad cannot be negative.");
    if (!fechaadquisicion) errors.push("fechaadquisicion is required.");

    if (errors.length > 0) {
      return res.status(400).json({ msg: "Validation errors.", errors });
    }

    const connection = await getConnection();
    await connection.query(querysInventariosl.postInventariol, [
      idproducto,
      cantidad,
      fechaadquisicion,
      activo ?? true
    ]);

    connection.release();
    res.json({ msg: "Inventory lot added successfully." });
  } catch (error) {
    console.error("Error in postInventariol:", error);
    res.status(500).send("An error occurred while adding the inventory lot.");
  }
};

// --------------------- PUT ---------------------
export const putInventariol = async (req, res) => {
  try {
    const { idlote } = req.params;
    const { idproducto, cantidad, fechaadquisicion, activo } = req.body;

    const connection = await getConnection();
    await connection.query(querysInventariosl.putInventariol, [
      idproducto,
      cantidad,
      fechaadquisicion,
      activo,
      idlote
    ]);

    connection.release();
    res.json({ msg: "Inventory lot updated successfully." });
  } catch (error) {
    console.error("Error in putInventariol:", error);
    res.status(500).send("An error occurred while updating the inventory lot.");
  }
};

// --------------------- DELETE ---------------------
export const deleteInventariol = async (req, res) => {
  try {
    const { idlote } = req.params;

    const connection = await getConnection();
    await connection.query(querysInventariosl.deleteInventariol, [idlote]);
    connection.release();

    res.json({ msg: "Inventory successfully removed." });
  } catch (error) {
    console.error("Error in deleteInventariol:", error);
    res.status(500).send("An error occurred while deleting the inventory lot.");
  }
};
