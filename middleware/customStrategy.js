const passport = require('passport');
const CustomLocalStrategy = require('./custom-local-strategy'); // Ruta a tu estrategia personalizada
import { runSelectQuery } from '../config/db.js';

passport.use('custom-local', new CustomLocalStrategy((emailOrUsername, password, done) => {
    console.log("hola")
  // Realiza la verificación personalizada aquí y llama a `done` con el usuario autenticado
  // o llama a `done` con `false` si la autenticación falla
  runSelectQuery("SELECT * FROM users WHERE email = '" + emailOrUsername + "' OR username = '" + emailOrUsername + "' AND password = '" + password + "'")
    .then(users => {
      if (users.length > 0) {
        const user = users[0];
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch(err => {
      return done(err);
    });
}));

// Resto de la configuración de tu aplicación
