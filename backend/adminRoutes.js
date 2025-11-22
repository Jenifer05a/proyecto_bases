import express from "express";
import sql from "mssql";  // <-- AGREGADO: Importa 'sql' para usar tipos en .input()
import { getConnection } from "./server.js";

const router = express.Router();

/* ----------------- CLIENTES ----------------- */
router.get("/clientes", async (req, res) => {
  try {
    const db = await getConnection();
    const result = await db.query("SELECT * FROM refaccionaria_el_cerrito.clientes");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/clientes", async (req, res) => {
  const { Nombre, Apellido, Telefono, ID_municipio } = req.body;
  try {
    const db = await getConnection();
    await db.request()
      .input("Nombre", sql.NVarChar, Nombre)
      .input("Apellido", sql.NVarChar, Apellido)
      .input("Telefono", sql.NVarChar, Telefono)
      .input("ID_municipio", sql.Int, ID_municipio)
      .query("INSERT INTO refaccionaria_el_cerrito.clientes (Nombre, Apellido, Telefono, ID_municipio) VALUES (@Nombre,@Apellido,@Telefono,@ID_municipio)");
    res.json({ message: "Cliente agregado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/clientes/:id", async (req, res) => {
  const { id } = req.params;
  const { Nombre, Apellido, Telefono, ID_municipio } = req.body;
  try {
    const db = await getConnection();
    await db.request()
      .input("ID_cliente", sql.Int, id)
      .input("Nombre", sql.NVarChar, Nombre)
      .input("Apellido", sql.NVarChar, Apellido)
      .input("Telefono", sql.NVarChar, Telefono)
      .input("ID_municipio", sql.Int, ID_municipio)
      .query("UPDATE refaccionaria_el_cerrito.clientes SET Nombre=@Nombre, Apellido=@Apellido, Telefono=@Telefono, ID_municipio=@ID_municipio WHERE ID_cliente=@ID_cliente");
    res.json({ message: "Cliente actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/clientes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getConnection();
    await db.request().input("ID_cliente", sql.Int, id)
      .query("DELETE FROM refaccionaria_el_cerrito.clientes WHERE ID_cliente=@ID_cliente");
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------- MUNICIPIOS ----------------- */
router.get("/municipios", async (req, res) => {
  try {
    const db = await getConnection();
    const result = await db.query("SELECT * FROM refaccionaria_el_cerrito.municipios");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/municipios", async (req, res) => {
  const { Nombre_municipio } = req.body;
  try {
    const db = await getConnection();
    await db.request()
      .input("Nombre_municipio", sql.NVarChar, Nombre_municipio)
      .query("INSERT INTO refaccionaria_el_cerrito.municipios (Nombre_municipio) VALUES (@Nombre_municipio)");
    res.json({ message: "Municipio agregado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/municipios/:id", async (req, res) => {
  const { id } = req.params;
  const { Nombre_municipio } = req.body;
  try {
    const db = await getConnection();
    await db.request()
      .input("ID_municipio", sql.Int, id)
      .input("Nombre_municipio", sql.NVarChar, Nombre_municipio)
      .query("UPDATE refaccionaria_el_cerrito.municipios SET Nombre_municipio=@Nombre_municipio WHERE ID_municipio=@ID_municipio");
    res.json({ message: "Municipio actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/municipios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getConnection();
    await db.request().input("ID_municipio", sql.Int, id)
      .query("DELETE FROM refaccionaria_el_cerrito.municipios WHERE ID_municipio=@ID_municipio");
    res.json({ message: "Municipio eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------- CATEGORIAS ----------------- */
router.get("/categorias", async (req, res) => {
  try {
    const db = await getConnection();
    const result = await db.query("SELECT * FROM refaccionaria_el_cerrito.categorias");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/categorias", async (req, res) => {
  const { Nombre_categoria } = req.body;
  try {
    const db = await getConnection();
    await db.request()
      .input("Nombre_categoria", sql.NVarChar, Nombre_categoria)
      .query("INSERT INTO refaccionaria_el_cerrito.categorias (Nombre_categoria) VALUES (@Nombre_categoria)");
    res.json({ message: "Categoría agregada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  const { Nombre_categoria } = req.body;
  try {
    const db = await getConnection();
    await db.request()
      .input("ID_categoria", sql.Int, id)
      .input("Nombre_categoria", sql.NVarChar, Nombre_categoria)
      .query("UPDATE refaccionaria_el_cerrito.categorias SET Nombre_categoria=@Nombre_categoria WHERE ID_categoria=@ID_categoria");
    res.json({ message: "Categoría actualizada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getConnection();
    await db.request().input("ID_categoria", sql.Int, id)
      .query("DELETE FROM refaccionaria_el_cerrito.categorias WHERE ID_categoria=@ID_categoria");
    res.json({ message: "Categoría eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------- PRODUCTOS ----------------- */
router.get("/productos", async (req, res) => {
  try {
    const db = await getConnection();
    const result = await db.query("SELECT * FROM refaccionaria_el_cerrito.productos");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/productos", async (req, res) => {
  const { Nombre_producto, Precio, Existencia, ID_categoria } = req.body;
  try {
    const db = await getConnection();
    await db.request()
      .input("Nombre_producto", sql.NVarChar, Nombre_producto)
      .input("Precio", sql.Decimal(10, 2), Precio)
      .input("Existencia", sql.Int, Existencia)
      .input("ID_categoria", sql.Int, ID_categoria)
      .query(`
        INSERT INTO refaccionaria_el_cerrito.productos (Nombre_producto, Precio, Existencia, ID_categoria)
        VALUES (@Nombre_producto, @Precio, @Existencia, @ID_categoria)
      `);
    res.json({ message: "Producto agregado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { Nombre_producto, Precio, Existencia, ID_categoria } = req.body;
  try {
    const db = await getConnection();
    await db.request()
      .input("Codigo", sql.NVarChar, id)  // Asumiendo que 'id' es el Codigo (nvarchar)
      .input("Nombre_producto", sql.NVarChar, Nombre_producto)
      .input("Precio", sql.Decimal(10, 2), Precio)
      .input("Existencia", sql.Int, Existencia)
      .input("ID_categoria", sql.Int, ID_categoria)
      .query("UPDATE refaccionaria_el_cerrito.productos SET Nombre_producto=@Nombre_producto, Precio=@Precio, Existencia=@Existencia, ID_categoria=@ID_categoria WHERE Codigo=@Codigo");
    res.json({ message: "Producto actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getConnection();
    await db.request().input("Codigo", sql.NVarChar, id)
      .query("DELETE FROM refaccionaria_el_cerrito.productos WHERE Codigo=@Codigo");
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------- VENTAS ----------------- */
router.get("/ventas", async (req, res) => {
  try {
    const db = await getConnection();
    const result = await db.query(`
      SELECT v.ID_venta,
             v.ID_cliente,
             CONCAT(c.Nombre, ' ', c.Apellido) AS Cliente,
             FORMAT(v.Fecha_venta, 'yyyy-MM-dd') AS Fecha_venta,
             v.Total_pago
      FROM refaccionaria_el_cerrito.ventas v
      INNER JOIN refaccionaria_el_cerrito.clientes c ON v.ID_cliente = c.ID_cliente
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/ventas", async (req, res) => {
  const { ID_cliente, Total_pago, Fecha_venta } = req.body;
  try {
    const db = await getConnection();
    const request = db.request()
      .input("ID_cliente", sql.Int, ID_cliente)
      .input("Total_pago", sql.Decimal(10, 2), Total_pago);

    let query = "";
    
    if (Fecha_venta) {
        request.input("Fecha_venta", sql.Date, Fecha_venta);
        query = `INSERT INTO refaccionaria_el_cerrito.ventas (ID_cliente, Fecha_venta, Total_pago) OUTPUT INSERTED.ID_venta VALUES (@ID_cliente, @Fecha_venta, @Total_pago)`;
    } else {
        query = `INSERT INTO refaccionaria_el_cerrito.ventas (ID_cliente, Fecha_venta, Total_pago) OUTPUT INSERTED.ID_venta VALUES (@ID_cliente, GETDATE(), @Total_pago)`;
    }

    const result = await request.query(query);
    res.json({ ID_venta: result.recordset[0].ID_venta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/ventas/:id", async (req, res) => {
  const { id } = req.params;
  const { Fecha_venta, Total_pago } = req.body;
  try {
    const db = await getConnection();
    await db.request()
      .input("ID_venta", sql.Int, id)
      .input("Fecha_venta", sql.Date, Fecha_venta)
      .input("Total_pago", sql.Decimal(10, 2), Total_pago)
      .query("UPDATE refaccionaria_el_cerrito.ventas SET Fecha_venta=@Fecha_venta, Total_pago=@Total_pago WHERE ID_venta=@ID_venta");
    res.json({ message: "Venta actualizada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/ventas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getConnection();
    await db.request().input("ID_venta", sql.Int, id)
      .query("DELETE FROM refaccionaria_el_cerrito.ventas WHERE ID_venta=@ID_venta");
    res.json({ message: "Venta eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------- DETALLE VENTA ----------------- */
router.get("/detalle_venta", async (req, res) => {
  try {
    const db = await getConnection();
    const result = await db.query("SELECT * FROM refaccionaria_el_cerrito.detalle_venta");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/detalle_venta", async (req, res) => {
  const { ID_venta, Codigo_producto, Cantidad, Precio_unitario, Subtotal } = req.body;
  try {
    const db = await getConnection();
    await db.request()
      .input("ID_venta", sql.Int, ID_venta)
      .input("Codigo_producto", sql.NVarChar, Codigo_producto)
      .input("Cantidad", sql.Int, Cantidad)
      .input("Precio_unitario", sql.Decimal(10, 2), Precio_unitario)
      .input("Subtotal", sql.Decimal(10, 2), Subtotal)
      .query(`
        INSERT INTO refaccionaria_el_cerrito.detalle_venta (ID_venta, Codigo_producto, Cantidad, Precio_unitario, Subtotal)
        VALUES (@ID_venta, @Codigo_producto, @Cantidad, @Precio_unitario, @Subtotal)
      `);
    res.json({ message: "Detalle de venta agregado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
