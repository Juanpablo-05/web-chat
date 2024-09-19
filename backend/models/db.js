import mysql from 'mysql2'

export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'chat',
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos con el ID:', connection.threadId);
});