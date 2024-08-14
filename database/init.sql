CREATE TABLE users (
    Id SERIAL PRIMARY KEY,
    Creation_Date TIMESTAMP DEFAULT NULL,
    Modification_Date TIMESTAMP DEFAULT NULL,
    Email varchar(255) NOT NULL,
    Password varchar(255) NOT NULL
);