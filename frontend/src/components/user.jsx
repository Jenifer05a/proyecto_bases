import React from "react";
import "./estilos.css";

export default function UserPanel({ onLogout }) {
  const nombreUsuario = localStorage.getItem("nombre");
  const compras = JSON.parse(localStorage.getItem("compras") || "[]");
  const productos = JSON.parse(localStorage.getItem("productos") || "[]");

  return (
    <div className="user-panel">
      <header>
        <h1>Bienvenido, {nombreUsuario}</h1>
        <button onClick={onLogout}>Cerrar sesión</button>
      </header>

      {compras.length > 0 ? (
        <section className="compras-section">
          <h2>Mis Compras</h2>
          <table>
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
                  <td>${c.Total_pago}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <section className="productos-section">
          <h2>Productos Disponibles</h2>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.Codigo}>
                  <td>{p.Codigo}</td>
                  <td>{p.Nombre_producto}</td>
                  <td>${p.Precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}