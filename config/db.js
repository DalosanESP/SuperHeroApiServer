// import mysql2 from 'mysql2';
// import dotenv from 'dotenv';
// dotenv.config();

// export const con = mysql2.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//   });

import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  user: 'fl0user',
  host: 'ep-still-dew-39348852.eu-central-1.aws.neon.tech',
  database: 'superheroApiUsers',
  password: 'Tq4VKnUoQF8a',
  port: 5432,
  ssl: {
    require: true, // Habilita SSL
  },
}); client.connect();

// Función para ejecutar una consulta SELECT
export async function runSelectQuery(query) {
  try {
    console.log(query);
    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    throw err; // Puedes manejar el error según tus necesidades
  }
}