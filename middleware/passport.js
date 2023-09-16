import { Strategy as LocalStrategy } from 'passport-local';
import "../app.js";

const configureLocalStrategy = (con) => {
    const localStrategy = new LocalStrategy(
        {
            usernameField: 'emailOrUsername',
            passwordField: 'password',
        },
        function (emailOrUsername, password, done) {
            console.log('CORVI');
            con.query('SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?', [emailOrUsername, emailOrUsername, password], (err, results) => {
                if (err) {
                    return done(err);
                }

                if (results.length > 0) {
                    let user = results[0];
                    global.globalUser = user;
                    return done(null, user, { message: 'Login successful' });
                } else {
                    return done(null, false, { message: 'Invalid credentials' });
                }
            });
        }
    );

    return localStrategy;
};

export default configureLocalStrategy;
