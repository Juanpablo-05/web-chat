import { connection } from "../../models/db.js";

// Crear mensaje
export const createMessage = (req, res) => {
  const { content, usuIdFK, salIdFK, date } = req.body;

  connection.query(
    "INSERT INTO mensaje (Men_Content, Men_Usu_IdFK, Men_Sal_IdFK, Men_Date) VALUES (?, ?, ?, ?)",
    [content, usuIdFK, salIdFK, date],
    (error) => {
      if (error) {
        console.error("Error al crear el mensaje:", error);
        res.status(500).json({ message: "Error en el servidor", error });
        return;
      }

      res.status(200).json({ message: "Mensaje creado exitosamente" });
    }
  );
};

// Obtener todos los mensajes
export const getAllMessages = (req, res) => {
  connection.query("SELECT * FROM mensaje", (error, results) => {
    if (error) {
      console.error("Error al obtener los mensajes:", error);
      res.status(500).json({ message: "Error de servidor" });
      return;
    }

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: "No se han encontrado mensajes" });
    }
  });
};

// Obtener un mensaje por ID
export const getMessageById = (req, res) => {
  const { id } = req.params;

  connection.query(
    `
    SELECT Men_Content, Men_Sal_IdFK, Men_Usu_IdFK, Men_Date,Usu_Nombre
    FROM mensaje
    INNER JOIN usuario ON Men_Usu_IdFK = Usu_Id
    WHERE Men_Sal_IdFK = ?; 
    `,
    [id],
    (error, results) => {
      if (error) {
        console.error("Error al obtener el mensaje:", error);
        res.status(500).json({ message: "Error de servidor" });
        return;
      }

      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "No tienes mensajes en este chat" });
      }
    }
  );
};

// Actualizar un mensaje
export const updateMessage = (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  connection.query(
    "UPDATE mensaje SET Men_Content = ? WHERE Men_Id = ?",
    [content, id],
    (error) => {
      if (error) {
        console.error("Error al actualizar el mensaje:", error);
        res.status(500).json({ message: "Error en el servidor", error });
        return;
      }

      res.status(200).json({ message: "Mensaje actualizado exitosamente" });
    }
  );
};

// Eliminar un mensaje
export const deleteMessage = (req, res) => {
  const { id } = req.params;

  connection.query("DELETE FROM mensaje WHERE Men_Id = ?", [id], (error) => {
    if (error) {
      console.error("Error al eliminar el mensaje:", error);
      res.status(500).json({ message: "Error en el servidor", error });
      return;
    }

    res.status(200).json({ message: "Mensaje eliminado exitosamente" });
  });
};
