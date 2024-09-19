  import { connection } from "../../models/db.js";

  //login
  export const loginUser = (req, res) => {
      const { usuario, password } = req.body;
    
      connection.query(
        'SELECT * FROM usuario WHERE BINARY Usu_NomUsuario = ? AND Usu_Password = ?',
        [usuario, password],
        (error, results) => {
          if (error) {
            console.error('Error al realizar la consulta:', error);
            res.status(500).send('Error de servidor');
            return;
          }
    
          if (results.length > 0) {
            const user = results[0]; // Asumiendo que hay un único usuario con estas credenciales
            res.status(200).json({ message: 'Login exitoso', user });
          } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
          }
        }
      );
  }
  //register
  export const registerUser = (req, res) => {
    const { name, userName, password } = req.body;
    const profileImage = req.file ? req.file.path : null;

    if (!req.file) {
      res.status(400).json({ message: 'No se ha cargado ninguna imagen' });
      return;
    }  
  
    connection.query(
      'INSERT INTO usuario (Usu_Nombre, Usu_NomUsuario, Usu_Password, Usu_ProfileImage) VALUES (?, ?, ?, ?)',
      [name, userName, password, profileImage],
      (error) => {
        if (error) {
          console.error('Error al registrar el usuario:', error);
          res.status(500).json({ message: 'Error en el servidor', error });
          return;
        }
  
        res.status(200).json({ message: 'Registro exitoso' });
      }
    );
  }