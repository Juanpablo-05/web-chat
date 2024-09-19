import { connection } from "../../models/db.js";

//obtener usuarios
export const getAllUser = (req, res) =>{
    connection.query(
      'SELECT * FROM usuario',
      (error, results) => {
        if (error) {
          console.error('Error al obtener los usuarios:', error);
          res.status(500).send('Error de servidor');
          return;
        }
  
        res.status(200).json(results);
      }
    );
}
//obterner un usuario por su nombre de usuraio
export const getUserByUsername = (req, res) => {
    const { username } = req.body;
    connection.query(
        'SELECT * FROM usuario WHERE Usu_NomUsuario LIKE ?',
        [`%${username}%`],
        (error, results) => {
            if (error) {
                console.error('Error al obtener el usuario por nombre de usuario:', error);
                res.status(500).send('Error de servidor');
                return;
            } else {
                if (results.length === 0) {
                    res.status(404).send('Usuario no encontrado');
                } else {
                    console.log(`Usuario encontrado: ${JSON.stringify(results)}`);
                    res.status(200).json(results);
                }
            }
        }
    );
}

//obtener un unico usuario
export const getUser = (req, res) => {
    const { id } = req.params
    connection.query(
        'SELECT * FROM usuario WHERE Usu_Id = ?',
        [id],
        (error, results) => {
            if (error) {
              console.error('Error al obtener los usuarios:', error);
              res.status(500).send('Error de servidor');
              return;
            } else {
                if (results.length === 0) {
                    res.status(404).send('Usuario no encontrado');
                } else {
                    console.log(`Usuario encontrado: ${JSON.stringify(results)}`);
                    res.status(200).json(results);
                }
            }
          }
    )
}
//actualizar un usuario
export const updateUser = (req, res) => {
    const { name, userName, password } = req.body
    const { id } = req.params
    connection.query(
    'UPDATE usuario SET Usu_Nombre = ?, Usu_NomUsuario = ?, Usu_Password = ? WHERE Usu_Id = ?',
    [name, userName, password,id],
    (error, results) => {
        if (error) {
            console.error('Error al actualizar el usuario:', error);
            res.status(500).send('Error de servidor');
            return;
        } else {
            if (results.length === 0) {
                res.status(404).send('Usuario no encontrado');
            } else {
                console.log(`Usuario actualizado: ${JSON.stringify(results)}`);
                res.status(200).json({ message: 'Usuario actualizado con éxito' });
            }
        }
    }
    )
}
//eliminar usuario
export const deleteUsuer = (req, res) => {
    const { id } = req.params
    connection.query(
        'DELETE FROM usuario WHERE Usu_Id = ?',
        [id],
        (error, results) => {
            if (error) {
                console.error('Error al eliminar el usuario:', error);
                res.status(500).send('Error de servidor');
                return;
            } else {
                if (results.affectedRows === 0) {
                    res.status(404).send('Usuario no encontrado');
                } else {
                    console.log(`Usuario eliminado: ${JSON.stringify(results)}`);
                    res.status(200).json({ message: 'Usuario eliminado con éxito' });
                }
            }
        }
    )
}