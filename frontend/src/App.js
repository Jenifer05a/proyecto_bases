import React, { useState, useEffect } from "react";
import Auth from "./components/login";
import AdminPanel from "./components/admin";
import UserPanel from "./components/user";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");

  const handleLoginSuccess = (rol, nombre) => {
    setLoggedIn(true);
    setUserRole(rol);
    setUserName(nombre);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    setLoggedIn(false);
    setUserRole("");
    setUserName("");
  };

  return (
    <div className="app-container">
      {!loggedIn ? (
        <Auth onLoginSuccess={(rol, nombre) => handleLoginSuccess(rol, nombre)} />
      ) : (
        <div className="dashboard">
          <h2>¡Bienvenido, {userName}!</h2>
          <p>Rol: {userRole}</p>

          {userRole === "admin" ? (
            <div>
              <h3>Panel de Administrador</h3>
              {/* Aquí puedes poner CRUD de usuarios, reportes, etc. */}
            </div>
          ) : (
            <div>
              <h3>Panel de Usuario</h3>
              {/* Aquí contenido para usuario normal */}
            </div>
          )}

          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}
