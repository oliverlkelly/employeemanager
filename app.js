const inquirer = require('inquirer');
const { prompt } = require('inquirer');
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
const queryAddEmployHelp = 'SELECT employees.firstName, employees.lastName, employees.roleId, roles.title FROM employees INNER JOIN roles ON employees.roleId = roles.id WHERE employees.isReport=TRUE;';

function getRoles(){
    connection.query(queryRoles, (err, res) => {
        if(err) throw err;
        console.table(res);
    });
}

function newRole(){
    connection.query(queryDepart, (err, res) => {
        let departChoice = res.map(function (res) {
            return res['depart'];
        });
        prompt([
            { type: 'input', name: 'newRoleTitle', message: 'What is the name of this new Role?' },
            { type: 'input', name: 'newRoleSalary', message: 'What is the salary of this new Role?' },
            {
                type: 'list',
                name: 'newRoleDepart',
                message: 'Which Department is this new Role under?',
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
}

function getDeparts(){
    connection.query(queryDepart, (err, res) => {
        if(err) throw err;
        console.table(res);
    });
}

function newDepart(){
    prompt([
        { type: 'input', name: 'newDepartTitle', message: 'What is the name of this new Department?' },
    ])
    .then((answers) => {
        connection.query(queryDepart, 
        {
            department: answers.newDepartTitle
        },
        (err, res) => {
            if(err) throw err;
            console.table(res);
        });
    });
}

function getEmploys(){
    connection.query(queryEmploy, (err, res) => {
        if (err) throw err;
        console.table(res);
    });
}

function addEmploy(){
    connection.query(queryRoles, (err, res) => {
        let roleChoice = res.map(function (res) {
            return res['title'];
        });
        let roles = res;
        connection.query(queryAddEmployHelp, ( err, res ) => {
            let managerChoice = res.map(function (res) {
                return {
                    name: res.first_name + ' ' + res.last_name+ ": " + res.title,
                    value: res.role_id
                };
            } );
            prompt([
                { type: 'input', name: 'newEmployFirst', message: '\n New employee`s first name?' },
                { type: 'input', name: 'newEmployLast', message: 'New employee`s last name?' },
                {
                    type: 'list',
                    name: 'newEmployRole',
                    message: 'New employee`s role?',
                    choices: roleChoice
                },
                {
                    type: 'list',
                    name: 'newEmployManager',
                    message: 'New employee`s manager?',
                    choices: managerChoice
                }
            ])
            .then( ( answers ) => {
                let employRole = roles.find(role => role.title === answers.newEmpRole);
                connection.query(queryAddEmploy, {
                    id: employRole.id,
                    firstName: answers.newEmployFirst,
                    lastName: answers.newEmployLast,
                    reportTo: answers.newEmployManager,
                    role_id: employRole.id
                }, (err, res) => {
                    if (err) throw err;
                });

            });
        });
    });
}

async function menuFunct(){
    inquirer.prompt(menu).then((menuChoice) => {
        switch(menuChoice.choice){
            case 'View All Employees':
                getEmploys();
                menuFunct();
                break;
            case 'Add New Employee':
                addEmploy();
                getEmploys();
                menuFunct();
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
                newRole(); 
                menuFunct();               
                break;
            case 'View All Departments':
                getDeparts();
                menuFunct();
            case 'Add New Department':
                newDepart();
                menuFunct();
                break;
            case 'Finished':
                connection.end();
                break;
        }
    });
}

menuFunct();