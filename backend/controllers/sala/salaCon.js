import { connection } from "../../models/db.js";

// Crear una sala
export const createRoom = (req, res) => {
  const { name, usuIdFK } = req.body;
  const profileImage = req.file ? req.file.path : null;

  if (!req.file) {
    res.status(400).json({ message: 'No se ha cargado ninguna imagen' });
    return;
  }

  connection.query(
    'INSERT INTO sala (Sal_Nombre, Sal_Usu_IdFK, Sal_ProfileImage) VALUES (?, ?, ?)',
    [name, usuIdFK, profileImage],
    (error, results) => {
      if (error) {
        console.error('Error al crear la sala:', error);
        res.status(500).json({ message: 'Error en el servidor', error });
        return;
      }

      const roomId = results.insertId;

      const queryAddUserToRoom = 'INSERT INTO sala_usuario (Sal_IdFK, Usu_IdFK) VALUES (?, ?)';

      connection.query(queryAddUserToRoom, [roomId, usuIdFK], (error) => {
        if (error) {
          console.error('Error al añadir el usuario a la sala:', error);
          res.status(500).json({ message: 'Error al añadir el usuario a la sala' });
          return;
        }

        res.status(200).json({
          message: 'Sala creada y usuario añadido correctamente',
          salaId: roomId
        });
      });
    }
  );
};

// Obtener todas las salas
export const getAllRoom = (req, res) => {
  connection.query(
    'SELECT * FROM sala',
    (error, results) => {
      if (error) {
        console.error('Error al obtener las salas:', error);
        res.status(500).send('Error de servidor');
        return;
      }

      res.status(200).json(results);
    }
  );
};

// Obtener la imagen de portada de una sala por ID
export const getRoomImage = (req, res) => {
  const { id } = req.params;

  connection.query(
    'SELECT Sal_ProfileImage FROM sala WHERE Sal_Id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error('Error al obtener la imagen de la sala:', error);
        res.status(500).send('Error de servidor');
        return;
      }

      if (results.length > 0) {
        res.status(200).json({ imageUrl: results[0].Sal_ProfileImage });
      } else {
        res.status(404).json({ message: 'Imagen de sala no encontrada' });
      }
    }
  );
};

// Obtener una sala por ID
export const getRoom = (req, res) => {
  const { id } = req.params;

  connection.query(
    'SELECT * FROM sala WHERE Sal_Id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error('Error al obtener la sala:', error);
        res.status(500).send('Error de servidor');
        return;
      }

      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ message: 'Sala no encontrada' });
      }
    }
  );
};

// Actualizar una sala
export const updateRoom = (req, res) => {
  const { id } = req.params;
  const { nombre, password } = req.body;

  connection.query(
    'UPDATE sala SET Sal_Nombre = ?, Sal_Password = ? WHERE Sal_Id = ?',
    [nombre, password, id],
    (error) => {
      if (error) {
        console.error('Error al actualizar la sala:', error);
        res.status(500).json({ message: 'Error en el servidor', error });
        return;
      }

      res.status(200).json({ message: 'Sala actualizada con éxito' });
    }
  );
};

// Eliminar una sala
export const deleteRoom = (req, res) => {
  const { id } = req.params;

  connection.query(
    'DELETE FROM sala WHERE Sal_Id = ?',
    [id],
    (error) => {
      if (error) {
        console.error('Error al eliminar la sala:', error);
        res.status(500).json({ message: 'Error en el servidor', error });
        return;
      }

      res.status(200).json({ message: 'Sala eliminada con éxito' });
    }
  );
};
