import React, { useState } from "react";
import AdminPanel from "./components/admin";
import Auth from "./components/login";
import UserPanel from "./components/user";

export default function App() {
  // Estados de sesión
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [rol, setRol] = useState(localStorage.getItem("rol") || null);
  const [nombre, setNombre] = useState(localStorage.getItem("nombre") || "");

  // Login exitoso desde Auth
  const handleLoginSuccess = (token, rol, nombre) => {
    localStorage.setItem("token", token);
    localStorage.setItem("rol", rol);
    localStorage.setItem("nombre", nombre);

    setToken(token);
    setRol(rol);
    setNombre(nombre);
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("nombre");

    setToken(null);
    setRol(null);
    setNombre("");
  };

  return (
    <div className="app-container">
      {/* Si NO hay sesión, mostrar login */}
      {!token ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <h2>¡Bienvenido, {nombre}!</h2>

          {/* Si es administrador */}
          {rol === "admin" ? (
            <AdminPanel token={token} />
          ) : (
            /* Si es usuario normal */
            <UserPanel token={token} />
          )}

          {/* Botón cerrar sesión */}
          <button onClick={handleLogout} style={{ marginTop: "20px" }}>
            Cerrar sesión
          </button>
        </>
      )}
    </div>
  );
}
