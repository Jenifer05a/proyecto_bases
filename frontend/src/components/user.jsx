import React, { useEffect, useState } from "react";
import axios from "axios";
import "./estilos.css";

export default function UserPanel({ onLogout }) {
  const [productos, setProductos] = useState([]);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const nombre = localStorage.getItem("nombre") || "Usuario";
  const rol = localStorage.getItem("rol") || "usuario";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Headers con token
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // 1. Productos
        const prodRes = await axios.get("http://localhost:5000/api/auth/productos", { headers });
        setProductos(prodRes.data);

        // 2. Compras propias
        const comprasRes = await axios.get("http://localhost:5000/api/auth/mis-compras", { headers });
        setCompras(comprasRes.data);

      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <p>Cargando datos...</p>;

  return (
    <div className="user-panel">
      {/* Header */}
      <header className="header-user">
        <h1>Bienvenido, {nombre}</h1>
        <h3>Rol: {rol}</h3>
        {onLogout && (
          <button onClick={onLogout} className="logout-btn">
            Cerrar sesión
          </button>
        )}
      </header>

      {/* Productos */}
      <section className="productos-section">
        <h2>Productos Disponibles</h2>
        {productos.length > 0 ? (
          <table className="tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre Producto</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.Codigo}>
                  <td>{p.Codigo}</td>
                  <td>{p.Nombre_producto}</td>
                  <td>${Number(p.Precio).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No hay productos disponibles</p>
        )}
      </section>

      {/* Compras propias */}
      <section className="compras-section">
        <h2>Mis Compras</h2>
        {compras.length > 0 ? (
          <table className="tabla">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((c) => (
                <tr key={c.ID_venta}>
                  <td>{c.ID_venta}</td>
                  <td>{c.Fecha_venta}</td>
                  <td>${Number(c.Total_pago).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No has realizado compras aún</p>
        )}
      </section>
    </div>
  );
}

