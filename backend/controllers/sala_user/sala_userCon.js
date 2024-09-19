import { connection } from "../../models/db.js";

// Crear sala_usuario
export const createSalaUsuario = (req, res) => {
  const { Sal_IdFK, users } = req.body;

  if (!users || users.length === 0) {
    return res.status(400).json({ message: "No se han proporcionado usuarios." });
  }

  const values = users.map((Usu_IdFK) => [Sal_IdFK, Usu_IdFK]);

  const query = "INSERT INTO sala_usuario (Sal_IdFK, Usu_IdFK) VALUES ?";

  connection.query(query, [values], (error) => {
    if (error) {
      console.error("Error al crear la sala_usuario:", error);
      return res.status(500).json({ message: "Error en el servidor", error });
    }

    res.status(200).json({ message: "Usuarios agregados a la sala exitosamente" });
  });
};

// Obtener todas las sala_usuario
export const getAllSalaUsuarios = (req, res) => {
  const { id } = req.params;

  const query = `
        SELECT sala_usuario.*, Sal_Nombre, Usu_Nombre 
        FROM sala_usuario
        INNER JOIN sala ON Sal_IdFK = sala.Sal_Id
        INNER JOIN usuario ON Usu_IdFK = usuario.Usu_Id
        WHERE Usu_IdFK = ?;
    `;

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error al obtener las sala_usuario:", error);
      res.status(500).json({ message: "Error de servidor" });
      return;
    }

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: "No se han encontrado sala_usuario" });
    }
  });
};

//obtener todos los usuarios que esten en una sala
export const getUserRoom = (req, res) => {

    const {id} = req.params

    const query = `
        SELECT Sal_Nombre, Usu_Nombre 
        FROM sala_usuario
        INNER JOIN sala ON Sal_IdFK = sala.Sal_Id
        INNER JOIN usuario ON Usu_IdFK = usuario.Usu_Id
        WHERE Sal_IdFK = ?
        `

    connection.query(query, [id], (error, results) => {
        if (error) {
          console.error("Error al obtener los usuarios:", error);
          res.status(500).json({ message: "Error de servidor" });
          return;
        }
    
        if (results.length > 0) {
          res.status(200).json(results);
        } else {
          res.status(404).json({ message: "No se han encontron usuarios en esta sala" });
        }
      })
}

// Obtener una sala_usuario por ID
export const getSalaUsuario = (req, res) => {

    const query = `
          SELECT sala_usuario.*, Sal_Nombre, Usu_Nombre 
          FROM sala_usuario
          INNER JOIN sala ON Sal_IdFK = sala.Sal_Id
          INNER JOIN usuario ON Usu_IdFK = usuario.Usu_Id
      `;
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener las sala_usuario:", error);
        res.status(500).json({ message: "Error de servidor" });
        return;
      }
  
      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: "No se han encontrado sala_usuario" });
      }
    });
  };

// Actualizar una sala_usuario
export const updateSalaUsuario = (req, res) => {
  const { id } = req.params;
  const { Sal_IdFK, Usu_IdFK } = req.body;

  const query = "UPDATE sala_usuario SET Sal_IdFK = ?, Usu_IdFK = ? WHERE SalUsu_Id = ?"

  connection.query(
    query,
    [Sal_IdFK, Usu_IdFK, id],
    (error) => {
      if (error) {
        console.error("Error al actualizar la sala_usuario:", error);
        res.status(500).json({ message: "Error en el servidor", error });
        return;
      }

      res.status(200).json({ message: "Sala_usuario actualizado exitosamente" });
    }
  );
};

// Eliminar una sala_usuario
export const deleteSalaUsuario = (req, res) => {
  const { id } = req.params;

  connection.query(
    "DELETE FROM sala_usuario WHERE SalUsu_Id = ?",
    [id],
    (error) => {
      if (error) {
        console.error("Error al eliminar la sala_usuario:", error);
        res.status(500).json({ message: "Error en el servidor", error });
        return;
      }

      res.status(200).json({ message: "Sala_usuario eliminado exitosamente" });
    }
  );
};
