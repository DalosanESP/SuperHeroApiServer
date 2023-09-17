import passport from 'passport';
import { Strategy } from 'passport-strategy';
import { runSelectQuery } from '../config/db.js';

class CustomLocalStrategy extends Strategy {
    constructor(options, verify) {
        super();
        this.name = 'custom-local'; // Nombre de tu estrategia personalizada
        this.verify = verify; // Función de verificación personalizada

        // Más configuraciones personalizadas si es necesario
    }

    authenticate(req) {
        const emailOrUsername = req.body.emailOrUsername;
        const password = req.body.password;

        try {
            // Realiza la verificación personalizada aquí
            runSelectQuery("SELECT * FROM users WHERE email = '" + emailOrUsername + "' OR username = '" + emailOrUsername + "' AND password = '" + password + "'")
                .then(users => {
                    if (!users || users.length === 0) {
                        return this.fail({ message: 'Invalid credentials' });
                    }

                    const user = users[0];
                    console.log(user)

                    passport.serializeUser((user, done) => {
                        done(null, user.id);
                    });

                    passport.deserializeUser((id, done) => {
                        // Llama a la función usersDAO.findById para buscar el usuario por su ID
                        // usersDAO.findById(id, (err, user) => {
                        //     if (err) {
                        //         return done(err); // Si ocurre un error, pasa el error a done
                        //     }

                        //     if (!user) {
                        //         // Si no se encuentra el usuario, pasa null como usuario
                        //         return done(null, null);
                        //     }

                        //     // Si se encuentra el usuario, pasa el usuario encontrado como resultado

                            done(null, user);
                        // });
                    });

                    return this.success(user, { message: 'Login successful' });
                })
                .catch(error => {
                    return this.fail(error);
                });
        } catch (error) {
            return this.fail(error);
        }
    }
};

export default CustomLocalStrategy;