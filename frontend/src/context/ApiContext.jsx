import { createContext, useState, useEffect, useContext } from "react";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
    // Estados para la API 
    const [user, setUser] = useState([])//informacion del usuario
    const [roomUser ,setRoomUser] = useState([])//informacion del usuario y a que sala pertenece
    const [room, setRoom] = useState([])//imformacion de la sala
    const [userRoom, setUserRoom] = useState([]) //todos los usuarios que pertenezcan a un grupo
    const [roomId, setRoomId] = useState(null)

    const fetchRoomUser = async (url) =>{
        try {
            const response = await fetch(url);
            const data = await response.json();
            setRoomUser(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const fetchRoom = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/room/${id}`);
            const data = await response.json();
            setRoom(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const fetchUserRoom = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setUserRoom(data)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        const urlRoomUser = `http://localhost:3001/salaUser/${user.Usu_Id}`
        const url = 'http://localhost:3001/salaUser/'
        fetchRoomUser(urlRoomUser)
        fetchUserRoom(url)
    }, [user]);
  
    return (
      <ApiContext.Provider
        value={{
          user,
          roomUser,
          room,
          userRoom,
          roomId,
          setRoomId,
          setUserRoom,
          setRoom,
          setRoomUser,
          setUser,
          fetchRoom,
        }}
      >
        {children}
      </ApiContext.Provider>
    );
};