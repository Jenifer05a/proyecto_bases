import express from "express";
import { getConnection } from "./server.js";

const router = express.Router();

/* ===========================================
   OBTENER TODOS LOS PRODUCTOS (GET)
=========================================== */
router.get("/productos", async (req, res) => {
  try {
    const db = await getConnection();

    const result = await db.request().query(`
      SELECT Codigo, Nombre_producto, Precio
      FROM refaccionaria_el_cerrito.productos
    `);

    res.json(result.recordset); // <-- devuelve un array con los productos
  } catch (error) {
    console.error("[/productos] Error:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

export default router;
