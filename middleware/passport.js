import { Strategy as LocalStrategy } from 'passport-local';
import { runSelectQuery } from "../config/db.js";
import "../app.js";

const configureLocalStrategy = () => {
    const localStrategy = new LocalStrategy(
        {
            emailOrUsername: 'emailOrUsername',
            password: 'password',
        },
        async function (emailOrUsername, password, done) {
            console.log('CORVI');
            const users = await runSelectQuery("SELECT * FROM users WHERE email = '" + emailOrUsername + "' OR username = '" + emailOrUsername + "' AND password = '" + password + "'");
            // con.query('SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?', [emailOrUsername, emailOrUsername, password], (err, results) => {


            if (users.length > 0) {
                let user = users[0];
                return done(null, user, { message: 'Login successful' });
            } else {
                return done(null, false, { message: 'Invalid credentials' });
            }
        });
    return localStrategy;
}
export default configureLocalStrategy;
