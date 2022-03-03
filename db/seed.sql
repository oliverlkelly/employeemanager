USE employeetracker_db;
INSERT INTO departments(department)
VALUES
("Executive"),
("Operation"),
("Production"),
("Engineering"),
("Legal"),
("IT and Security");
INSERT INTO roles(title, salary, deptId)
VALUES
("Chief Executive Officer", 1600000, 1),
("Chief Operations Officer", 1300000, 1),
("Managing Director", 700000, 2),
("Director of Product", 400000, 3),
("Engineering Manager", 200000, 4),
("Software Engineer", 90000, 4),
("Executive Counsel", 120000, 5),
("Support Engineer", 77000, 6);
INSERT INTO employees(firstName, lastName, deptId, roleId, reportTo, isReport)
VALUES
("Bose", "Mann", 1, 1, NULL, TRUE),
("Tope", "Lahdey", 1, 2, NULL, TRUE),
("Leagle", "Eagle", 5, 7, 1, TRUE),
("William", "Manahge", 2, 3, 2, TRUE),
("Codey", "Wellers", 4, 6, 5, TRUE),
("Simon", "Says", 4, 5, 4, TRUE),
("Isne", "Tworkdown", 6, 8, 3, TRUE),
("Howca", "Nihelp", 6, 8, 3, TRUE);

