import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../../styles/login/Register_module.css";

function Register() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null); // Nuevo estado para la foto de perfil

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("userName", userName);
    formData.append("password", password);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "Usuario Registrado Con Exitoso!",
          text: "sera redirigido a la pagina de Login",
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
      } else {
        const errorText = await response.text(); // Obtener el texto de la respuesta
        console.error("Error en la respuesta del servidor:", errorText);
        Swal.fire({
          title: "Error",
          text: `Respuesta del servidor: ${errorText}`,
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }

      if (response.status === 500) {
        Swal.fire({
          title: "Upps parece que algo salio mal en el servidor!",
          text: "intentelo nuevamente mas tarde...",
          icon: "error",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Upps algo salio mal!",
        text: `intentelo nuevamente y rellene los campos correctamente ${error}...`,
        icon: "error",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/");
        }
      });

      console.log(error);
    }
  };

  return (
    <div className="container-register">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} className="form-register">
        <div>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="userName">Nombre de Usuario:</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="profileImage">Foto de Perfil (opcional):</label>
          <input
            type="file"
            id="profileImage"
            onChange={(e) => setProfileImage(e.target.files[0])} // Manejar el archivo de la foto de perfil
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
