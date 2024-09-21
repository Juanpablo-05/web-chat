import React, { useContext, useState, useEffect } from "react";
import "../../styles/room/AddUserRoom_module.css";
import { ApiContext } from "../../context/apiContext";

import { useTransition, animated, useSpring } from "react-spring";

function AddUserRoom() {
  const [userName, setUserName] = useState("");
  const [userList, setUserList] = useState([]);
  const [userData, setUserData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);

  const { roomId } = useContext(ApiContext);

  console.log(userList)

  const fechtUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/user/");
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("error al hacer el feching: " + error);
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

  useEffect(() => {
    fechtUsers();
  }, []);

  const transitions = useTransition(dataFilter, {
    from: { opacity: 0, transform: "translateY(-20px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
    keys: (user) => user.Usu_NomUsuario,
  });

  return (
    <section className="container">
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
