// import { con } from '../config/db.js'
import { runSelectQuery } from "../config/db.js";
import express from "express";
import passport from 'passport';
import { generateRandomNumber } from '../helpers/helpers.js';

const app = express();
app.use(express.static('views'));

export const usersDAO = {};

// Método para obtener todos los usuarios
usersDAO.getAllUsers = (req, res) => {
  con.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    } else {
      res.json(results);
    }
  });
};

// Método para obtener un usuario por su ID
usersDAO.getUserById = (req, res) => {
  const userId = req.params.id;
  con.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ message: 'Usuario no encontrado' });
      } else {
        res.json(results[0]);
      }
    }
  });
};

usersDAO.getUserByUsername = (req, res) => {
  const username = req.params.username;
  con.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ message: 'Usuario no encontrado' });
      } else {
        res.json(results[0]);
      }
    }
  });
};

// Método para obtener un usuario por su dirección de correo electrónico (email)
usersDAO.getUserByEmail = (req, res) => {
  const email = req.params.email;
  con.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ message: 'Usuario no encontrado' });
      } else {
        res.json(results[0]);
      }
    }
  });
};

// Método para crear un nuevo usuario
usersDAO.createUser = async function (req, res) {
  const newUser = req.body;
  const users = await runSelectQuery("SELECT * FROM users WHERE email = '" + req.body.email + "' OR username = '" + req.body.email + "'")
  if (users.length > 0) {
    res.status(500).json({ error: 'Ya existe un usuario asociado a ese nombre o email, esto hay que cambiarlo' });
  } else {
    newUser.webId = generateRandomNumber();
    console.log(newUser);
    const result = await runSelectQuery("INSERT INTO users (webId, username, email, password) VALUES ( '" + newUser.webId + "', '" + newUser.username + "', '" + newUser.email + "', '" + newUser.password + "')");
    res.redirect('http://127.0.0.1:3001/main');
  }
}

// Método para actualizar los datos de un usuario
usersDAO.updateUser = (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;
  con.query('UPDATE users SET ? WHERE id = ?', [updatedUser, userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Usuario no encontrado' });
      } else {
        res.json({ message: 'Usuario actualizado exitosamente' });
      }
    }
  });
};

// Método para eliminar un usuario por su ID
usersDAO.deleteUserById = (req, res) => {
  const userId = req.params.id;
  con.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Usuario no encontrado' });
      } else {
        res.json({ message: 'Usuario eliminado exitosamente' });
      }
    }
  });
};

usersDAO.login = (req, res) => {
  const emailOrUsername = req.body.emailOrUsername;
  const password = req.body.password;
  console.log(emailOrUsername);
  console.log(password);
  con.query('SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?', [emailOrUsername, emailOrUsername, password], (err, results) => {
    if (err) {
      // Manejo del error en caso de que ocurra un problema con la consulta.
      console.error(err);
      return res.status(500).json({ message: 'Error de inicio de sesión' });
    }

    if (results.length > 0) {
      // Si hay resultados, el inicio de sesión es exitoso.
      // Aquí podrías utilizar Passport.js para gestionar la autenticación si lo deseas.
      // Por ahora, simplemente respondemos con un mensaje de éxito.
      return res.render('../views/main.html');
    } else {
      // Si no hay resultados, las credenciales son inválidas.
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
  });
};

passport.serializeUser(function (user, done) {
  done(null, user.webId);
});

passport.deserializeUser(async function (id, done) {
  try {
    // Ejecuta una consulta SELECT utilizando la función runSelectQuery
    const users = await runSelectQuery("SELECT * FROM users WHERE webId = '" + id + "'");

    if (users.length > 0) {
      return done(null, users[0]);
    } else {
      return done(null, null);
    }
  } catch (err) {
    return done(err);
  }
});