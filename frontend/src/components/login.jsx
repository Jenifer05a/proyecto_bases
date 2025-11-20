import React, { useState } from "react";
import axios from "axios";
import "./estilos.css";

export default function Auth({ onLoginSuccess }) {
  const [tab, setTab] = useState("login");

  // Login
  const [correoLogin, setCorreoLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  // Registro
  const [nombreReg, setNombreReg] = useState("");
  const [correoReg, setCorreoReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [rolReg, setRolReg] = useState("usuario");
  const [mensajeReg, setMensajeReg] = useState("");
  const [errorReg, setErrorReg] = useState("");

  // ---- LOGIN ----
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorLogin("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        correo: correoLogin,
        password: passwordLogin,
      });

      const { token, rol, nombre } = res.data;

      // Guardamos en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);
      localStorage.setItem("nombre", nombre);

      // Llamamos a App.jsx para actualizar estado
      onLoginSuccess(token, rol, nombre); // <-- esto permitirá "redireccionar" al admin
    } catch (err) {
      setErrorLogin(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  // ---- REGISTRO ----
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorReg("");
    setMensajeReg("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        nombre: nombreReg,
        correo: correoReg,
        password: passwordReg,
        rol: rolReg,
      });

      setMensajeReg(res.data.message || "Usuario registrado correctamente");
      setNombreReg("");
      setCorreoReg("");
      setPasswordReg("");
      setRolReg("usuario");
    } catch (err) {
      setErrorReg(err.response?.data?.error || "Error al registrar usuario");
    }
  };

  return (
    <div className="auth-container">
      <div className="tabs">
        <button onClick={() => setTab("login")} className={tab === "login" ? "active" : ""}>Login</button>
        <button onClick={() => setTab("register")} className={tab === "register" ? "active" : ""}>Registro</button>
      </div>

      {tab === "login" && (
        <form onSubmit={handleLogin}>
          <h2>Iniciar Sesión</h2>
          <input
            type="email"
            placeholder="Correo"
            value={correoLogin}
            onChange={e => setCorreoLogin(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={passwordLogin}
            onChange={e => setPasswordLogin(e.target.value)}
            required
          />
          {errorLogin && <p className="error">{errorLogin}</p>}
          <button type="submit">Ingresar</button>
        </form>
      )}

      {tab === "register" && (
        <form onSubmit={handleRegister}>
          <h2>Registrar Usuario</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={nombreReg}
            onChange={e => setNombreReg(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo"
            value={correoReg}
            onChange={e => setCorreoReg(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={passwordReg}
            onChange={e => setPasswordReg(e.target.value)}
            required
          />
          <select value={rolReg} onChange={e => setRolReg(e.target.value)}>
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
          {mensajeReg && <p className="success">{mensajeReg}</p>}
          {errorReg && <p className="error">{errorReg}</p>}
          <button type="submit">Registrar</button>
        </form>
      )}
    </div>
  );
}
