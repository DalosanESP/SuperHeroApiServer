create database superhero_api_users;
use superhero_api_users; 

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  webId VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  picture VARCHAR(255),
  favorites JSON
);
