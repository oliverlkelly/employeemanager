DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;
USE employeetracker_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    department VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary INT,
    deptId INT,
    PRIMARY KEY (id),
    FOREIGN KEY (deptId) REFERENCES departments(id)
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(30) NOT NULL,
    lasName VARCHAR(30) NOT NULL,
    deptId INT,
    roleId INT NOT NULL,
    reportTo INT,
    isReport BOOLEAN,
    PRIMARY KEY(id),
    FOREIGN KEY(deptId) REFERENCES departments(id),
    FOREIGN KEY(roleId REFERENCES departments(id),
    FOREIGN KEY(reportTo) REFERENCES employees(id)
);