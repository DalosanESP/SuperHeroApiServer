// import mysql2 from 'mysql2';
// import dotenv from 'dotenv';
// dotenv.config();

// export const con = mysql2.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//   });

import pgPromise from 'pg-promise';

// Inicializa pg-promise
const pgp = pgPromise();

// Configura la conexión a la base de datos
const db = pgp({
  user: 'fl0user',
  host: 'ep-still-dew-39348852.eu-central-1.aws.neon.tech',
  database: 'superheroApiUsers',
  password: 'Tq4VKnUoQF8a',
  port: 5432,
  ssl: {
    require: true, // Habilita SSL
  },
});

// Función para ejecutar una consulta SELECT
export async function runSelectQuery(query) {
  try {
    console.log(query);

    // Utiliza db.any para ejecutar consultas
    const result = await db.any(query);

    return result;
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);

    // Manejo de errores, según sea necesario

    throw err;
  }
}