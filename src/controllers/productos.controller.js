import { getConnection, querysProductos } from "../database/index.js";

// --------------------- GET ---------------------
export const getProductos = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(querysProductos.getProductos);
    connection.release();
    res.json(result.rows);
  } catch (error) {
    console.error("Error in getProductos:", error);
    res.status(500).send("An error occurred while retrieving products.");
  }
};

// --------------------- GET BY ID ---------------------
export const getProducto = async (req, res) => {
  try {
    const { idproducto } = req.params;
    const connection = await getConnection();
    const result = await connection.query(querysProductos.getProducto, [idproducto]);
    connection.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Product not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error in getProducto:", error);
    res.status(500).send("An error occurred while retrieving the product.");
  }
};

// --------------------- POST ---------------------
export const postProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, id_categoria, existencia_minima, status } = req.body;

    if (!nombre || !descripcion || !precio || !id_categoria) {
      return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
    }

    const existenciaMinima = existencia_minima ?? 10;
    const statusValue = status ?? 1;

    const connection = await getConnection();
    await connection.query(querysProductos.postProducto, [
      nombre,
      descripcion,
      precio,
      id_categoria,
      existenciaMinima,
      statusValue
    ]);
    
    connection.release();
    res.json({ msg: "Product added successfully." });
  } catch (error) {
    console.error("Error in postProducto:", error);
    res.status(500).send("An error occurred while adding the product.");
  }
};

// --------------------- PUT ---------------------
export const putProducto = async (req, res) => {
  try {
    const { idproducto } = req.params;
    const { nombre, descripcion, precio, id_categoria, existencia_minima, status } = req.body;

    if (!nombre || !descripcion || !precio || !id_categoria) {
      return res.status(400).json({ msg: "Bad Request. Please fill all fields." });
    }

    const precioNumber = Number(precio);
    if (isNaN(precioNumber)) {
      return res.status(400).json({ msg: "The price must be a valid number." });
    }

    const connection = await getConnection();
    await connection.query(querysProductos.putProducto, [
      nombre,
      descripcion,
      precioNumber,
      id_categoria,
      existencia_minima || 10,
      status || 1,
      idproducto
    ]);

    connection.release();
    res.json({ msg: "Product updated successfully." });
  } catch (error) {
    console.error("Error in putProducto:", error);
    res.status(500).send("An error occurred while updating the product.");
  }
};

// --------------------- DELETE ---------------------
export const deleteProducto = async (req, res) => {
  try {
    const { idproducto } = req.params;
    const connection = await getConnection();
    await connection.query(querysProductos.deleteProducto, [idproducto]);
    connection.release();
    res.json({ msg: "Product successfully removed." });
  } catch (error) {
    console.error("Error in deleteProducto:", error);
    res.status(500).send("An error occurred while deleting the product.");
  }
};
