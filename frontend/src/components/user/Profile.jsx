import React, { useContext } from "react";
import { ApiContext } from "../../context/apiContext";
import "../../styles/user/Profile_module.css";

function Profile() {
  const { user } = useContext(ApiContext);

  const profileImageUrl = `http://localhost:3001/${user.Usu_ProfileImage}`;

  return (
    <div className="profile-container">
      <div className="container_img">
        {user.Usu_ProfileImage ? (
          <img src={profileImageUrl} alt="Profile" />
        ) : (
          <img src="../../public/defaultImageProfile.png" alt="" />
        )}
      </div>
      <div className="container_des">
        <h3>@{user.Usu_NomUsuario}</h3>
        <span>{user.Usu_Nombre}</span>
      </div>
    </div>
  );
}

export default Profile;
