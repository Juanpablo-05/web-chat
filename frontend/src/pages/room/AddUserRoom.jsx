import React, { useContext, useState, useEffect } from "react";
import "../../styles/room/AddUserRoom_module.css";
import { ApiContext } from "../../context/apiContext";

function AddUserRoom() {
  const [userName, setUserName] = useState("");
  const [userList, setUserList] = useState([]);
  const [userData, setUserData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);

  const { roomId } = useContext(ApiContext);

  const fechtUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/user/");
      const data = await response.json();

      setUserData(data);
    } catch (error) {
      console.error("error al hacer el feching: " + error)
    }
  };

  const filter = (input) => {
    const filtered = userData.filter((user) => 
      user.Usu_NomUsuario.toLowerCase().includes(input.toLowerCase())
    );
    if (filtered.length > 0) {
      setDataFilter(filtered)
      console.log( "usuarios filtrados: " + JSON.stringify(dataFilter));
    } else {
      setDataFilter([{
        message: "no se encontro ningun usuraio con este nombre..."
      }]);
       
    }

    
  }

  const handleFilter = (e)=>{
    filter(e.target.value)
    console.log(dataFilter)
  }

  const handleAddUserList = () => {
    if (userName.trim()) {
      setUserList([...userList, userName]);
      setUserName("");
    }
  };

  const handleRemoveUser = (index) => {
    const newList = userList.filter((_, i) => i !== index);
    setUserList(newList);
  };

  const handleAddUser = async () => {
    const response = await fetch("http://localhost:3001/salaUser/create", {
      method: "POST",
      body: JSON.stringify({
        roomId: roomId,
        users: userList,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setNewRoom({
        roomId: "",
        users: [],
      });
    }
  };

  useEffect(()=>{
    fechtUsers()
  }, [])

  return (
    <section className="container">
      <div className="container_title">
        <h2>Agregar Usuarios</h2>
        <p>Por favor agregue los usuarios que estaran en su grupo</p>
      </div>

      <div className="container_grup">
        <input
          type="text"
          onChange={handleFilter}
          placeholder="Nombre del usuario"
        />
        {/* <button onClick={handleAddUserList}>Agregar</button> */}
      </div>

      {/* <div className="container_user_list">
        <ul>
          {userList.map((user, index) => (
            <li key={index}>
              {user}
              <button onClick={() => handleRemoveUser(index)}>Quitar</button>
            </li>
          ))}
        </ul>
      </div> */}

      {/* <div className="container_btn">
        {userList.length > 0 ? (
          <button onClick={handleAddUser} className="btn active">
            Añadir
          </button>
        ) : (
          <button onClick={handleAddUser} className="btn">
            Añadir
          </button>
        )}
      </div> */}
    </section>
  );
}

export default AddUserRoom;
