import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import dotenv from 'dotenv'
import "../app.js";

dotenv.config();

export function configureGoogleAuth(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.clientId,
        clientSecret: process.env.clientSecret,
        callbackURL: 'http://127.0.0.1:3000/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            console.log('Iniciando estrategia de autenticación de Google');
            
            // Ejecuta una consulta SELECT utilizando la función runSelectQuery
            console.log(profile.id);
            const users = await runSelectQuery("SELECT * FROM users WHERE webId = '" + profile.id + "'");
            console.log(users)
            if (users.length > 0) {
                console.log('Usuario existente');
                // User exists, update data if needed
                // Update logic goes here
                return done(null, users[0]);
            } else {
                console.log('Creando nuevo usuario');
                // User doesn't exist, create a new user
                const newUser = {
                    webId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    picture: profile.photos[0].value,
                    favorites: null
                };
                   
                // Ejecuta una consulta INSERT utilizando la función runSelectQuery
                const result = await runSelectQuery('INSERT INTO users SET ?', newUser);
                
                newUser.id = result.insertId;
                return done(null, newUser);
            }
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        try {
            // Ejecuta una consulta SELECT utilizando la función runSelectQuery
            const users = await runSelectQuery('SELECT * FROM users WHERE id = $1', [id]);
            
            if (users.length > 0) {
                return done(null, users[0]);
            } else {
                return done(null, null);
            }
        } catch (err) {
            return done(err);
        }
    });
}
