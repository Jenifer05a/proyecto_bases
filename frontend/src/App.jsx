import React, { useState } from "react";
import AdminPanel from "./components/admin"; 
import Auth from "./components/login";
import UserPanel from "./components/user";
export default function App() {
  // Estados para controlar sesión
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [rol, setRol] = useState(localStorage.getItem("rol") || null);
  const [nombre, setNombre] = useState(localStorage.getItem("nombre") || "");

  // Función que se llama desde Auth después del login
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
      {!token ? (
        // Muestra Login/Registro si no hay sesión
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : rol === "admin" ? (
        // Panel de administrador
        <div>
          <h2>¡Bienvenido, {nombre}!</h2>
          <AdminPanel token={token} onLogout={handleLogout} />
        </div>
      ) : (
        // Panel de usuario normal
        <div>
          <h2>¡Bienvenido, {nombre}!</h2>
          <h3>Panel de Usuario</h3>
        </div>
      )}

      {token && (
        <button onClick={handleLogout} style={{ marginTop: "20px" }}>
          Cerrar sesión
        </button>
      )}
    </div>
  );
}
