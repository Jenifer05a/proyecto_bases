import express from "express";
import { getConnection } from "./server.js";

const router = express.Router();

// Ruta para login y lógica solicitada
router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const db = await getConnection();

    // 1. Verificar usuario en tabla Usuarios
    const userResult = await db
      .request()
      .input("usuario", usuario)
      .input("password", password)
      .query("SELECT ID_usuario, Nombre, Rol FROM Usuarios WHERE Usuario = @usuario AND Password = @password");

    if (userResult.recordset.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = userResult.recordset[0];

    // 2. Buscar cliente con el mismo nombre
    const clienteResult = await db
      .request()
      .input("nombre", user.Nombre)
      .query("SELECT ID_cliente FROM Clientes WHERE Nombre = @nombre");

    if (clienteResult.recordset.length > 0) {
      // 3. Si existe cliente → obtener compras
      const cliente = clienteResult.recordset[0];
      const comprasResult = await db
        .request()
        .input("idCliente", cliente.ID_cliente)
        .query("SELECT ID_venta, Fecha_venta, Total_pago FROM Ventas WHERE ID_cliente = @idCliente");

      return res.json({
        token: "TOKEN_GENERADO",
        rol: user.Rol,
        nombre: user.Nombre,
        compras: comprasResult.recordset
      });
    } else {
      // 4. Si no existe → devolver productos
      const productosResult = await db
        .request()
        .query("SELECT Codigo, Nombre_producto, Precio FROM Productos");

      return res.json({
        token: "TOKEN_GENERADO",
        rol: user.Rol,
        nombre: user.Nombre,
        productos: productosResult.recordset
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Ruta para obtener productos (opcional)
router.get("/productos", async (req, res) => {
  try {
    const db = await getConnection();
    const result = await db.request().query("SELECT Codigo, Nombre_producto, Precio FROM Productos");
    res.json(result.recordset);
  } catch {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Ruta para obtener compras por cliente (opcional)
router.get("/compras/:idCliente", async (req, res) => {
  const { idCliente } = req.params;
  try {
    const db = await getConnection();
    const result = await db
      .request()
      .input("idCliente", idCliente)
      .query("SELECT ID_venta, Fecha_venta, Total_pago FROM Ventas WHERE ID_cliente = @idCliente");
    res.json(result.recordset);
  } catch {
    res.status(500).json({ error: "Error al obtener compras" });
  }
});

export default router;