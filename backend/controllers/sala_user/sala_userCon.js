import { connection } from "../../models/db.js";

// Crear sala_usuario
export const createSalaUsuario = (req, res) => {
  const { Sal_IdFK, users } = req.body;

  if (!users || users.length === 0) {
    return res
      .status(400)
      .json({ message: "No se han proporcionado usuarios." });
  }

  // Consultar los IDs de los usuarios basados en sus nombres
  const query = "SELECT Usu_Id FROM usuario WHERE Usu_NomUsuario IN (?)";
  connection.query(query, [users], (error, results) => {
    if (error) {
      console.error("Error al obtener los usuarios:", error);
      return res.status(500).json({ message: "Error en el servidor", error });
    }

    const values = results.map((user) => [Sal_IdFK, user.Usu_Id]);

    if (values.length === 0) {
      return res.status(400).json({ message: "No se encontraron usuarios con esos nombres." });
    }

    const insertQuery = "INSERT INTO sala_usuario (Sal_IdFK, Usu_IdFK) VALUES ?";
    connection.query(insertQuery, [values], (error) => {
      if (error) {
        console.error("Error al crear la sala_usuario:", error);
        return res.status(500).json({ message: "Error en el servidor", error });
      }

      res
        .status(200)
        .json({ message: "Usuarios agregados a la sala exitosamente" });
    });
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
  const { id } = req.params;

  const query = `
        SELECT Sal_Nombre, Usu_Nombre 
        FROM sala_usuario
        INNER JOIN sala ON Sal_IdFK = sala.Sal_Id
        INNER JOIN usuario ON Usu_IdFK = usuario.Usu_Id
        WHERE Sal_IdFK = ?
        `;

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error al obtener los usuarios:", error);
      res.status(500).json({ message: "Error de servidor" });
      return;
    }

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res
        .status(404)
        .json({ message: "No se han encontron usuarios en esta sala" });
    }
  });
};

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

  const query =
    "UPDATE sala_usuario SET Sal_IdFK = ?, Usu_IdFK = ? WHERE SalUsu_Id = ?";

  connection.query(query, [Sal_IdFK, Usu_IdFK, id], (error) => {
    if (error) {
      console.error("Error al actualizar la sala_usuario:", error);
      res.status(500).json({ message: "Error en el servidor", error });
      return;
    }

    res.status(200).json({ message: "Sala_usuario actualizado exitosamente" });
  });
};

// Eliminar una sala_usuario
export const deleteSalaUsuario = (req, res) => {
  const { id } = req.params; // Aquí recibes el Sal_Id (ID de la sala)

  console.log('ID de sala recibido:', id); // Para verificar qué ID de sala se está enviando

  // Primero eliminamos todas las relaciones en sala_usuario asociadas a la sala
  connection.query(
    "DELETE FROM sala_usuario WHERE Sal_IdFK = ?",
    [id],
    (error, result) => {
      if (error) {
        console.error("Error al eliminar las relaciones sala_usuario:", error);
        return res.status(500).json({ message: "Error en el servidor", error });
      }

      if (result.affectedRows === 0) {
        // Si no se encontró ninguna relación sala_usuario
        return res.status(404).json({ message: "No se encontraron registros de sala_usuario asociados a esta sala" });
      }

      // Si se eliminaron las relaciones, intentamos eliminar la sala
      const queryDeleteSala = `
        DELETE FROM sala 
        WHERE Sal_Id = ? AND NOT EXISTS (SELECT 1 FROM sala_usuario WHERE Sal_IdFK = ?)
      `;

      connection.query(queryDeleteSala, [id, id], (error, result) => {
        if (error) {
          console.error("Error al eliminar la sala:", error);
          return res.status(500).json({ message: "Error en el servidor", error });
        }

        if (result.affectedRows === 0) {
          // Si no se eliminó ninguna sala, significa que probablemente la sala todavía tiene relaciones pendientes
          return res.status(200).json({ message: "Relaciones sala_usuario eliminadas, pero la sala no se eliminó porque aún tiene usuarios." });
        }

        // Si se eliminó la sala también
        res.status(200).json({ message: "Sala y relaciones sala_usuario eliminadas exitosamente" });
      });
    }
  );
};
