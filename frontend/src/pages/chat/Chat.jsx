//librerias y terceros
import io from "socket.io-client";
import { IoIosArrowDown } from "react-icons/io";
import { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

//conponentes y context
import { ApiContext } from "../../context/apiContext.jsx";
import "../../styles/room/Room_module.css";
import ButtonsActions from "../../components/room/ButtonsActions.jsx";

const socket = io("http://localhost:3001");

export default function Chat() {
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(null);

  const { id } = useParams();
  const { roomUser, room, fetchRoom, userRoom, user } = useContext(ApiContext);
  const messagesEndRef = useRef(null);

  const profileImageUrl = `http://localhost:3001/${room.Sal_ProfileImage}`;

  //para mandar al ultimo mensaje enviado
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //funcion para hacer visible las opciones
  const handleVisible = (index) => {
    setVisibleIndex(visibleIndex === index ? null : index);
  };

  //para enviar un mensaje
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", {
        Men_Sal_IdFK: id,
        Men_Usu_IdFK: roomUser[0].Usu_IdFK,
        Men_Content: message,
        Men_Date: new Date().toISOString(),
      });
      setMessage("");
      scrollToBottom();
    }
  };

  //para obtener la fecha y hora de un mensaje
  function getRelativeDate(dateString) {
    const messageDate = new Date(dateString);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (messageDate >= today) {
      return "Hoy";
    } else if (messageDate >= yesterday) {
      return "Ayer";
    } else {
      return messageDate.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  }

  //para filtarar los mienbros de un grupo
  useEffect(() => {
    const filteredMembers = userRoom.filter(
      (member) => Number(member.Sal_IdFK) === Number(id)
    );
    setGroupMembers(filteredMembers);
  }, [id, userRoom]);

  //para obtener los mensajes de una sala
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3001/message/${id}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    fetchRoom(id);
    socket.emit("joinRoom", id);

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [id, message]);

  return (
    <section className="container_chat">

      <section className="container_title">
        <div className="container_img">
          {room.Sal_ProfileImage ? (
            <img src={profileImageUrl} alt="Profile" />
          ) : (
            <img src="../../public/defaultGrupImage.png" />
          )}
        </div>

        <section className="container_title-grup">
          <div className="container_h2">
            <h2>{room.Sal_Nombre}</h2>
          </div>
          <div className="container_names">
            {groupMembers.map((items, i) => (
              <span>{items.Usu_Nombre}...</span>
            ))}
          </div>
        </section>
      </section>

      <section className="container_message">
        <ul>
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const formattedTime = new Date(msg.Men_Date).toLocaleTimeString(
                "es-ES",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );

              const relativeDate = getRelativeDate(msg.Men_Date);

              return (
                <li
                  key={msg.Men_Id}
                  className={
                    user.Usu_Id === msg.Men_Usu_IdFK
                      ? "message_grup-autor"
                      : "message_grup"
                  }
                >
                  <span>
                    {user.Usu_Id === msg.Men_Usu_IdFK ? null : msg.Usu_Nombre}
                  </span>
                  <p>{msg.Men_Content}</p>
                  <i>
                    {relativeDate} a las {formattedTime}
                  </i>
                  {visibleIndex === index ? <ButtonsActions messageId={msg.Men_Id}/> : null}
                  <button
                    className="btn_opc-message"
                    onClick={() => {
                      handleVisible(index)
                    }}
                  >
                    <IoIosArrowDown />
                  </button>
                </li>
              );
            })
          ) : (
            <p className="p">Inicia tu Chat con Este grupo!!!</p>
          )}
          <div ref={messagesEndRef} />
        </ul>
      </section>

      <section className="container_btn">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={sendMessage}>Enviar</button>
      </section>
      
    </section>
  );
}
