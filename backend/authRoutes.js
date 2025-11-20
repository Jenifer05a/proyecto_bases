import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getConnection } from "./server.js";

const router = express.Router();

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
      { id: user.ID_usuario, rol: user.Rol },
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

export default router;
