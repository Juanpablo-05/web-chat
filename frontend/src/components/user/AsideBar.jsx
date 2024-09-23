import React, { useContext, useEffect, useState } from "react";
import Profile from "../user/Profile";
import "../../styles/user/AsideBar_module.css";
import { ApiContext } from "../../context/apiContext";
import { Link } from "react-router-dom";
import ButtonNewRoom from "../room/ButtonNewRoom";

function AsideBar() {
  const { roomUser, roomId } = useContext(ApiContext);
  const [imagesProfile, setImagesProfile] = useState({}); 

  const fetchImage = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/room/imageProfile/${id}`);
      const data = await response.json();
      setImagesProfile((prevImages) => ({
        ...prevImages,
        [id]: data.imageUrl // Guardamos la imagen correspondiente al id de sala
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Efecto para cargar las imágenes al inicio
  useEffect(() => {
    roomUser.length > 0 ? (roomUser.forEach((room) => {
      fetchImage(room.Sal_IdFK);
    })) : null
  }, [roomUser])

  return (
    <>
      <div className="container_aside">
        <Profile />
        <hr />

        <div className="container_grup">
          <div className="container_top">
            <h3>Chats</h3>
            <ButtonNewRoom/>
          </div>
          <ul>
            {roomUser.length > 0 ? (
              roomUser.map((items, i) => {
                const urlProfileImage = imagesProfile[items.Sal_IdFK]
                  ? `http://localhost:3001/${imagesProfile[items.Sal_IdFK]}`
                  : "../../public/defaultGrupImage.png";
                return (
                  <li key={i}>
                    <div className="container_img">
                      <img src={urlProfileImage} alt="Profile" />
                    </div>
                    <Link to={`/home/chat/${items.Sal_IdFK}`} className="a">
                      {items.Sal_Nombre}
                    </Link>
                  </li>
                );
              })
            ) : <li>no estas en ningun grupo</li>}
          </ul>
        </div>
      </div>
    </>
  );
}

export default AsideBar;
