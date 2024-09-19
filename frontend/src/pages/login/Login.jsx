import React, { useContext } from "react";
import "../../styles/login/Login_module.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext.jsx";
import { ApiContext } from "../../context/apiContext.jsx";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { user, setUser } = useContext(ApiContext);

  const urlLogin = "http://localhost:3001/auth/login";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(urlLogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario: username, password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        Swal.fire({
          title: "Inicio de sesión Exitoso!",
          text: "sera redirigido a la pagina principal",
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            login();
            navigate("/home");
          }
        });
      }

      if (response.status === 401) {
        Swal.fire({
          title: "Error al iniciar sesión",
          text: "Las credenciales no coinciden. Por favor, verifique los datos.",
          icon: "warning",
          confirmButtonText: "Ok",
        });
      }
    } catch (e) {
      Swal.fire({
        title: "Error al iniciar sesión!",
        text: `Algo salio mal, intente mas tarde...`,
        icon: "warning",
        confirmButtonText: "Ok",
      });
    }
  };

  useEffect(() => {
}, [user]);

  return (
    <div className="container-login">
      <h2>Login</h2>
      <form className="form-login" onSubmit={handleLogin}>
        <div className="form-grup">
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-grup">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="btn-grup">
          <Link to={"/register"} className="link">
            Registrarse
          </Link>
          <button type="submit">Iniciar Sesión</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
