import React from "react";
import "../../styles/messsage/Message_module.css";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";


const ButtonsActions = ({menssageId}) => {
  const deleteMessage = async (menssageId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/message/delete/${menssageId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
      } else {
        console.error("Error al eliminar el mensaje");
      }
    } catch (error) {
      console.error("Error al eliminar el mensaje:", error);
    }
  };

  const editMessage = async (newContent) => {
    try {
      const response = await fetch(
        `http://localhost:3001/message/update/${messageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newContent }),
        }
      );
      if (response.ok) {
        const updatedMessage = await response.json();
        onMessageUpdated(updatedMessage);
      } else {
        console.error("Error al editar el mensaje");
      }
    } catch (error) {
      console.error("Error al editar el mensaje:", error);
    }
  };

  return (
    <div className="container_opcion">
      <button onClick={()=>{
        deleteMessage(menssageId)
      }}><FaTrash /></button>
      <button
        onClick={() => {
          const newContent = prompt("Editar mensaje:", "");
          if (newContent) {
            editMessage(newContent);
          }
        }}
      >
        <FaEdit />
      </button>
    </div>
  );
};

export default ButtonsActions;
