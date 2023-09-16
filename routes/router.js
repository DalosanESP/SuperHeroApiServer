import express from "express";
import passport from 'passport';
import { configureGoogleAuth } from '../middleware/googleAuth.js';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.js'
import { searchSuperHero, searchSuperHeroById } from "../controller/controller.js";
import { addFavoriteCharacter, searchFavorites } from "../helpers/helpers.js";
import { usersDAO } from "../database/users-dao.js";
// import { con } from '../config/db.js'
import configureLocalStrategy from "../middleware/passport.js";
import multer from 'multer';


const router = express.Router();
configureGoogleAuth(passport);
export let nameOfHero = null;
// const localStrategy = configureLocalStrategy(con);
// passport.use(localStrategy);

router.get('/', (req, res) => {
    res.redirect('http://127.0.0.1:3001/');
})


// Route to sign in with Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route after login
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('http://127.0.0.1:3001/main');
});

router.get('/main', ensureAuthenticated, (req, res) => {
    res.render('../../client/views/main.html')
})

router.get('/search', searchSuperHero);

router.get('/searchById', ensureAuthenticated, searchSuperHeroById);

router.get('/profile', ensureAuthenticated, searchFavorites);

router.get('/uploadImage', ensureAuthenticated, (req, res) => {
    res.render('../../client/views/uploadImage.html')
})

router.post('/addFavorite', ensureAuthenticated, addFavoriteCharacter);

router.post('/loginAuth', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log('Se produjo un error durante la autenticación.');
            return res.status(500).json({ error: 'Se produjo un error durante la autenticación.' });
        }
        if (!user) {
            // Autenticación fallida
            console.log('La autenticación falló');
            return res.status(401).json({ autenticado: false, mensaje: 'La autenticación falló.' });
        }

        // Autenticación exitosa, iniciar sesión del usuario
        req.logIn(user, (err) => {
            if (err) {
                console.log('Se produjo un error durante la sesión.')
                return res.status(500).json({ error: 'Se produjo un error durante la sesión.' });
            }

            // Usuario autenticado, enviar una respuesta de éxito
            console.log('Autenticación exitosa.')
            return res.status(200).json({ autenticado: true, mensaje: 'Autenticación exitosa.' });
        });
    })(req, res, next);
});

router.post('/newUser', usersDAO.createUser)
    

let upload;
// Path to handle image upload
router.post('/upload', (req, res) => {
    if (!upload) {
        upload = configureMulter();
    }
    upload.single('image')(req, res, err => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Image uploaded successfully' });
    });
});

export default router;