DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;
USE employeetracker_db;

CREATE TABLE departments{
    id INT NOT NULL AUTO_INCREMENT,
    department VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
};

CREATE TABLE roles{
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    
}