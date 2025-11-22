import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getConnection } from "./server.js";
import sql from "mssql";

const router = express.Router();

// ==================== REGISTRO ====================
router.post("/register", async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  if (!nombre || !correo || !password || !rol) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const db = await getConnection();
    const existe = await db.request().input("correo", correo)
      .query("SELECT * FROM Usuarios WHERE Correo = @correo");

    if (existe.recordset.length > 0) {
      return res.status(400).json({ error: "Este correo ya está registrado" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await db.request()
      .input("nombre", nombre)
      .input("correo", correo)
      .input("passwordHash", hash)
      .input("rol", rol)
      .query(`
        INSERT INTO Usuarios (Nombre, Correo, PasswordHash, Rol)
        VALUES (@nombre, @correo, @passwordHash, @rol)
      `);

    res.json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("Error en /register:", err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.status(400).json({ error: "Correo y contraseña requeridos" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "JWT_SECRET no configurado en .env" });
  }

  try {
    const db = await getConnection();
    const userQuery = await db.request().input("correo", correo)
      .query("SELECT * FROM Usuarios WHERE Correo = @correo");

    if (userQuery.recordset.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = userQuery.recordset[0];
    const validPassword = bcrypt.compareSync(password, user.PasswordHash);

    if (!validPassword) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.ID_usuario, rol: user.Rol, nombre: user.Nombre },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      rol: user.Rol,
      nombre: user.Nombre
    });
  } catch (err) {
    console.error("Error en /login:", err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// ==================== RUTAS PARA USUARIO NORMAL ====================
// Middleware para verificar token y rol
const authUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol !== "usuario") {
      return res.status(403).json({ error: "Acceso denegado: solo usuarios normales" });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};

// GET productos para usuario normal
router.get("/productos", authUser, async (req, res) => {
  try {
    const db = await getConnection();
    const result = await db.request()
      .query("SELECT Codigo, Nombre_producto, Precio FROM refaccionaria_el_cerrito.productos");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET compras propias del usuario
router.get("/mis-compras", authUser, async (req, res) => {
  try {
    const db = await getConnection();
    const result = await db.request()
      .input("nombre", req.user.nombre)
      .query(`SELECT v.ID_venta, 
        FORMAT(v.Fecha_venta, 'dd/MM/yyyy') AS Fecha_venta, v.Total_pago
        FROM refaccionaria_el_cerrito.Ventas v
        INNER JOIN refaccionaria_el_cerrito.Clientes c
        ON v.ID_cliente = c.ID_cliente
        WHERE c.Nombre = @nombre;

      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
