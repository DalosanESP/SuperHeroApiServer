import express from "express";
import bodyParser from "body-parser";
import session from 'express-session';
import passport from 'passport';
import router from "./routes/router.js";
import passportConfig from './middleware/passport.js';
import flash from "express-flash";
import cors from "cors"

const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));

passportConfig(passport);

app.use(flash());

app.use('/google/callback', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

const allowedOrigins = [
  'https://super-hero-api-dalosan.netlify.app/',
  'https://main--super-hero-api-dalosan.netlify.app/',
];

app.use(cors({
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Habilita el envío de cookies u otros datos de autenticación
}));

app.use(cors(corsOptions));

// Configura CORS para permitir solicitudes desde http://localhost:3000


app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);