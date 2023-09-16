import { con } from '../config/db.js'

const UserModel = {};

// Función para crear un nuevo usuario
UserModel.createGoogleUser = (googleId, name, email, picture, favorites, callback) => {
  const query = 'INSERT INTO users (webId, name, email, picture, favorites) VALUES (?, ?, ?, ?, ?)';
  con.query(query, [googleId, name, email, picture, favorites], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.insertId); // Devolvemos el ID del usuario creado
  });
};

// Función para obtener un usuario por su Google ID
UserModel.getUserByGoogleId = (googleId, callback) => {
  const query = 'SELECT * FROM users WHERE googleId = ?';
  con.query(query, [googleId], (err, rows) => {
    if (err) {
      return callback(err, null);
    }
    if (rows.length === 0) {
      return callback(null, null); // No se encontró ningún usuario con ese Google ID
    }
    return callback(null, rows[0]);
  });
};

// Función para actualizar los datos de un usuario
UserModel.updateGoogleUser = (userId, name, email, picture, favorites, callback) => {
  const query = 'UPDATE users SET name = ?, email = ?, picture = ?, favorites = ? WHERE id = ?';
  con.query(query, [name, email, picture, favorites, userId], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.affectedRows); // Devolvemos el número de filas actualizadas
  });
};

export default UserModel;