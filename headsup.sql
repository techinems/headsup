CREATE DATABASE IF NOT EXISTS headsup CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

USE headsup;

CREATE TABLE notes (
    id  int NOT NULL AUTO_INCREMENT,
    note text NOT NULL,
    PRIMARY KEY(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE dispatch_mishaps (
    id  int NOT NULL AUTO_INCREMENT,
    date date NOT NULL,
    mishap text NOT NULL,
    PRIMARY KEY(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE calls (
    prid int NOT NULL,
    cc varchar(255) NOT NULL,
    driver varchar(255) NOT NULL,
    category varchar(255) NOT NULL,
    response_code char(3) NOT NULL,
    PRIMARY KEY (prid)
);