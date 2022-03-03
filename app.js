const inquirer = require('inquirer');
const connection = require('./util/connection');

const menu = {
    type: 'list',
    message: 'What would you like to do?',
    choices: [
        'View All Employees',
        'Add New Employee',
        'Update Employee Role',
        'Remove Employee',
        'View All Roles',
        'Add New Role',
        'View All Departments',
        'Add New Department',
        'Finished'
    ],
    name: 'choice'
}

const queryDepart = 'SELECT * FROM departments';
const queryRoles = 'SELECT * FROM roles';
const queryEmploy = 'SELECT * FROM employees';

const queryAddDepart = 'INSERT INTO departments SET ?;';
const queryAddRole = 'INSERT INTO roles SET ?;';
const queryAddEmploy = 'INSERT INTO employees SET ?;';

const queryUpdateEmploy = 'UPDATE employees SET ? WHERE ?;';
const queryDeleteEmploy = 'DELETE FROM employees WHERE ?;';
const queryUpdateRole = 'UPDATE roles SET ? WHERE ?;';

const queryEmploysInfo = 'SELECT employees.id, employees.firstName, employees.lastName, roles.title, roles.salary, departments.department FROM employees LEFT JOIN roles ON employees.roleId = roles.id LEFT JOIN departments ON roles.deptId = departments.id;';
const queryRolesInfo = 'SELECT roles.id, roles.title, roles.salary, departments.department FROM roles LEFT JOIN departments ON roles.deptId = departments.id;';

function getRoles(){
    connection.query(queryRoles, (err, res) => {
        if(err) throw err;
        console.table(res);
    });
}

async function menuFunct(){
    inquirer.prompt(menu).then((menuChoice) => {
        switch(menuChoice.choice){
            case 'View All Employees':
                const getEmploys = connection.query(queryEmploy, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                });
                menuFunct();
                break;
            case 'Add New Employee':
                
                break;
            case 'Update Employee Role':
                
                break;
            case 'Remove Employee':
                
                break;
            case 'View All Roles':
                getRoles();
                menuFunct();
                break;
            case 'Add New Role':
                const newRole = connection.query(queryDepart, (err, res) => {
                    let departChoice = res.map(function (res) {
                        return res['dept'];
                    });
                    prompt([
                        { type: 'input', name: 'newRoleTitle', message: 'Name of New Role?' },
                        { type: 'input', name: 'newRoleSalary', message: 'Salary of New Role?' },
                        {
                            type: 'list',
                            name: 'newRoleDept',
                            message: 'Which department is this New Role under?',
                            choices: departChoice
                        }
                    ])
                    .then((answers) => {
                        connection.query(queryDepart, (err, res) => {
                            if (err) throw err;
                            const departments = res.find(departments => departments.deptartment === answers.newRoleDepart);
                            connection.query(queryAddRole,
                            {
                                title: answers.newRoleTitle,
                                salary: answers.newRoleSalary,
                                deptId: departments.id
                            }, (err, res) => {
                                if (err) throw err;
                                console.table(res);
                                getRoles();
                            });
                        });
                    });
                });
                menuFunct();               
                break;
            case 'View All Departments':
                const getDeptarts = connection.query(queryDepart, (err, res) => {
                    if(err) throw err;
                    console.table(res);
                });
                menuFunct();
            case 'Add New Department':
                
                break;
            case 'Finished':
                connection.end();
                break;
        }
    });
}

menuFunct();