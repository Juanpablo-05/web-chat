import React, { useContext, useState, useEffect } from "react";
import "../../styles/room/AddUserRoom_module.css";
import { ApiContext } from "../../context/apiContext";

import { useTransition, animated } from "react-spring";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function AddUserRoom() {
  const [userName, setUserName] = useState("");
  const [userList, setUserList] = useState([]);
  const [userData, setUserData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);

  const navigate = useNavigate();

  const { roomId, setRoomId } = useContext(ApiContext);

  const fechtUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/user/");
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("error al hacer el feching: " + error);
    }
  };

  const cancelCreate = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/salaUser/delete/${roomId}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Desea cancelar la creacion ?",
          text: "no se creara la sala si cancela",
          icon: "error",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/home");
            setRoomId("");
          }
        });
      } else {
        Swal.fire({
          title: "Error al eliminar la sala",
          text: "Por favor, intente nuevamente...",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error al eliminar la sala!",
        text: "Algo salió mal, intente más tarde...",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const filter = (input) => {
    const filtered = userData.filter((user) =>
      user.Usu_NomUsuario.toLowerCase().includes(input.toLowerCase())
    );
    if (filtered.length > 0) {
      setDataFilter(filtered);
    } else {
      setDataFilter([
        {
          message: "no se encontró ningún usuario con este nombre...",
        },
      ]);
    }
  };

  const handleFilter = (e) => {
    setUserName(e.target.value);
    filter(e.target.value);
  };

  const handleRemoveUser = (index) => {
    const newList = userList.filter((_, i) => i !== index);
    setUserList(newList);
  };

  const handleAddUser = (user) => {
    if (!userList.some((u) => u.Usu_NomUsuario === user.Usu_NomUsuario)) {
      setUserList([...userList, user]);
    }
  };

  const handleAddRoom = async () => {
    try {
      const response = await fetch("http://localhost:3001/salaUser/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Sal_IdFK: roomId,
          users: userList.map((user) => user.Usu_NomUsuario),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Sala creada",
          text: "Usuarios añadidos a la sala exitosamente",
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/home");
          }
        });
      } else {
        Swal.fire({
          title: "Error al crear la sala",
          text: data.message || "Por favor, intente nuevamente...",
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
  };

  useEffect(() => {
    fechtUsers();
  }, []);

  const transitions = useTransition(dataFilter, {
    from: { opacity: 0, transform: "translateY(-20px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    keys: (user) => user.Usu_NomUsuario,
  });

  return (
    <section className="container">
      <div className="container_btn">
        <button className="btn_cancelar" onClick={cancelCreate}>
          Cancelar
        </button>

        <button className="btn_add" onClick={handleAddRoom}>Añadir</button>
      </div>

      <section className="container_filter">
        <div className="container_title">
          <h2>Agregar Usuarios</h2>
          <p>Por favor agregue los usuarios que estarán en su grupo</p>
        </div>

        <div className="container_grup">
          <input
            type="text"
            value={userName}
            onChange={handleFilter}
            placeholder="Nombre del usuario"
          />
        </div>

        {userName.length > 0 ? (
          <animated.div className="container_list">
            <ul>
              {transitions((style, user) => (
                <animated.li style={style}>
                  {user.Usu_NomUsuario ? (
                    <>
                      {user.Usu_NomUsuario}
                      <button onClick={() => handleAddUser(user)}>
                        añadir
                      </button>
                    </>
                  ) : (
                    user.message
                  )}
                </animated.li>
              ))}
            </ul>
          </animated.div>
        ) : null}
      </section>

      <section className="container_list_section">
        <ul>
          {userList.length > 0 ? (
            userList.map((user, index) => (
              <li key={index}>
                {user.Usu_NomUsuario}
                <button onClick={() => handleRemoveUser(index)}>Quitar</button>
              </li>
            ))
          ) : (
            <li>
              <p>Sin usuarios seleccionados...</p>
            </li>
          )}
        </ul>
      </section>
    </section>
  );
}

export default AddUserRoom;
