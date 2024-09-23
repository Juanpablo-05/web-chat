import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ApiContext } from "../../context/apiContext";
import '../../styles/room/CreateRoom_module.css'

function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [roomImage, setRoomImage] = useState(null);
  const navigate = useNavigate();
  const { user, setRoomId, roomId } = useContext(ApiContext);

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", roomName);
    formData.append("profileImage", roomImage);
    formData.append("usuIdFK", user.Usu_Id);

    try {
      const response = await fetch("http://localhost:3001/room/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json(); 

      if (response.status === 200) {
        Swal.fire({
          title: "Sala creada exitosamente!",
          text: "Será redirigido al siguiente paso",
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            setRoomId(data.salaId)
            navigate("/home/create/room/addUser")
          }
        });
      } else {
        Swal.fire({
          title: "Error al crear la sala",
          text: "Por favor, intente nuevamente y rellene todos los campos...",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error al crear la sala!",
        text: "Algo salió mal, intente más tarde...",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }

    console.log("sala creada: ", roomId)
  };

 

  return (
    <section className="container-create-room">
      <h2>Crear Sala</h2>
      <form className="form-create-room" onSubmit={handleCreateRoom}>
        <div className="form-group">
          <label htmlFor="roomName">Nombre de la Sala:</label>
          <input
            type="text"
            id="roomName"
            name="roomName"
            required
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="roomImage">Portada del Grupo:</label>
          <input
            type="file"
            id="roomImage"
            name="roomImage"
            accept="image/*"
            onChange={(e) => setRoomImage(e.target.files[0])}
          />
        </div>
        <div className="btn-group">
          <button type="submit">Crear Sala</button>
        </div>
      </form>
    </section>
  );
}

export default CreateRoom;
