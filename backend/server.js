import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sql from "mssql";
import adminRoutes from "./adminRoutes.js"; // CRUD
import authRoutes from "./authRoutes.js"; // ✅ Importa el router de autenticación
import userRoutes from "./userRoutes.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------------------------------------
   🔌 CONFIGURACIÓN DE SQL SERVER DESDE .env
--------------------------------------------- */
export const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

export async function getConnection() {
  try {
    if (!pool) {
      pool = await sql.connect(dbConfig);
      console.log("📌 Conectado a SQL Server correctamente");
    }
    return pool;
  } catch (err) {
    console.error("❌ Error al conectar a SQL Server:", err.message);
    throw err;
  }
}

/* ---------------------------------------------
   🔗 RUTAS
--------------------------------------------- */
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes); // ✅ Ahora la ruta /api/auth/login existe
app.use("/api/user", userRoutes);

/* ---------------------------------------------
   🚀 INICIAR SERVIDOR
--------------------------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await getConnection();
    console.log(`🚀 Servidor funcionando en puerto ${PORT}`);
  } catch {
    console.log("❌ No se pudo iniciar el servidor por error de base de datos");
  }
});
