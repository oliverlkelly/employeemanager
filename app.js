const { prompt } = require('inquirer');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('./util/connection');

const questions = [{
    type: 'list',
    name: 'action',
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
        'Finished']
}];

const queryEmploys = 'SELECT * FROM employees;';
const queryRoles = 'SELECT * FROM roles;';
const queryDepts = 'SELECT * FROM departments;';

const queryEmploysInfo = 'SELECT employees.id, employees.firstName, employees.lastName, roles.title, roles.salary, departments.department FROM employees LEFT JOIN roles ON employees.roleId = roles.id LEFT JOIN departments ON roles.deptId = departments.id;';
const queryRolesInfo = 'SELECT roles.id, roles.title, roles.salary, departments.department FROM roles LEFT JOIN departments ON roles.deptId = departments.id;';

const queryEmploysBasic = 'SELECT id, firstName, lastName FROM employees;';
const queryRoleManagers = 'SELECT id,  FROM roles';

const queryEmployChoices = 'SELECT CONCAT(employees.firstName, " ", employees.lastName) AS employName FROM employees;';

const queryAddEmploy = 'INSERT INTO employees SET ?;';
const queryAddRole = 'INSERT INTO roles SET ?;';
const queryAddDept = 'INSERT INTO departments SET ?;';

const queryUpdateEmploy = 'UPDATE employees SET ? WHERE ?;';
const queryUpdateRole = 'UPDATE roles SET ? WHERE ?;';
const queryDeleteEmploy = 'DELETE FROM employees WHERE ?;';

const searchEmploy = () => {
    connection.query(queryEmploysInfo, (err, res) => {
        if (err) throw err;
        console.log(`\n\n\n
        *** Viewing all ${res.length} Employees *** \n`);
        console.table(res);
    });
    menuFunct();
};

const searchRole = () => {
    connection.query(queryRolesInfo, (err, res) => {
        if (err) throw err;
        console.log(`\n\n\n
        *** Viewing all ${res.length} Roles *** \n`);
        console.table(res);
    });
    menuFunct();
};

const searchDept = () => {
    connection.query(queryDepts, (err, res) => {
        if (err) throw err;
        console.log(`\n\n\n
        *** Viewing all Departments *** \n`);
        console.table(res);
    });
    menuFunct();
};

const addEmploy = () => {

    connection.query(queryRoles, (err, res) => {
        let roleChoices = res.map(function (res) {
            return res['title'];
        });
        let roles = res;
        connection.query( `SELECT employees.firstName, employees.lastName, employees.roleId, roles.title FROM employees INNER JOIN roles ON employees.roleId = roles.id WHERE employees.isReport=TRUE;`, ( err, res ) => {
            let managerChoices = res.map( function ( res ) {
                return {name: res.firstName + ' ' + res.lastName+ ": " + res.title,value: res.roleId};
            } );

            prompt([
                { type: 'input', name: 'newEmployFirst', message: '\n New employee`s first name?' },
                { type: 'input', name: 'newEmployLast', message: 'New employee`s last name?' },
                {
                    type: 'list',
                    name: 'newEmployRole',
                    message: 'New employee`s role?',
                    choices: roleChoices
                },
                {
                    type: 'list',
                    name: 'newRoleManager',
                    message: 'Employee`s manager?',
                    choices: managerChoices
                }
            ])
                .then( ( answers ) => {

                    let employRole = roles.find(role => role.title === answers.newEmployRole);

                        let employRoleManager = roles.find( role => role.id === answers.newRoleManager );
                        connection.query('INSERT INTO employees SET ?', {
                            firstName: answers.newEmployFirst,
                            lastName: answers.newEmployLast,
                            reportTo: answers.employRoleManager,
                            roleId: employRole.id
                        }, (err, res) => {
                            if (err) throw err;

                                console.log( ( '\n\n\n*** New Employee successfully added! ***\n' ) );
                                searchEmploy();
                        });

                });
        });
    });
};

const addRole = () => {
    connection.query(queryDepts, (err, res) => {
        let deptChoices = res.map(function (res) {
            return res['department'];
        });
        prompt([
            { type: 'input', name: 'newRoleTitle', message: 'Name of New Role?' },
            { type: 'input', name: 'newRoleSalary', message: 'Salary of New Role?' },
            {
                type: 'list',
                name: 'newRoleDept',
                message: 'Which department is this New Role under?',
                choices: deptChoices
            }
        ])
        .then((answers) => {
            connection.query(queryDepts, (err, res) => {
                if (err) throw err;
                const departments = res.find(departments => departments.department === answers.newRoleDept);
                connection.query(queryAddRole,
                {
                    title: answers.newRoleTitle,
                    salary: answers.newRoleSalary,
                    deptId: departments.id
                }, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    console.log('\n\n\n*** New Role successfully added! ***\n')

                    searchRole();
                });
            });
        });
    });
};

const addDept = () => {
    prompt([
        { type: 'input', name: 'newDept', message: 'Name of New Department?' }
    ])
    .then((answers) => {
        connection.query(queryAddDept,
            {
                department: answers.newDept
            }, (err, res) => {
                if (err) throw err;
                console.table(res);
                console.log('*** New Department successfully added! ***');

                searchDept();
            });
    });
};

const updateEmployRole = () => {
    connection.query(queryEmployChoices, (err, res) => {
        let employChoices = res.map(function (res) {
            return res['employName'];
            console.log(employChoices);
        });
        connection.query('SELECT roles.title FROM roles', (err, res) => {
            let roleChoices = res.map(function (res) {
                return res['title'];
                console.log(roleChoices);
            });
            prompt([
                {
                    type: 'list', name: 'updateEmploy', message: 'Which employee would you like to update?',
                    choices: employChoices
                },
                {
                    type: 'list', name: 'updateRole', message: 'Employee`s new role?',
                    choices: roleChoices
                }
            ])
                .then((answers) => {
                        connection.query(queryRoles, (err, res) => {
                            if ( err ) throw err;
                            let roles = res;
                            let updatedRole = roles.find(role => role.title === answers.updateRole);
                            console.log(updatedRole);

                                connection.query(queryEmploys, (err, res) => {
                                    if (err) throw err;
                                    let fullName = answers.updateEmploy.split(' ');
                                    const updatedEmploy = res.find(employees => employees.firstName + " " + employees.lastName === answers.updateEmploy);
                                    console.log(updatedEmploy);
                                    connection.query(queryUpdateEmploy,
                                        [
                                            {
                                                roleId: updatedRole.id
                                            },
                                            {
                                                id: updatedEmploy.id,
                                            }
                                        ], (err, res) => {
                                            if (err) throw err;
                                            console.log(err);
                                            // console.table(res);
                                            console.log('\n\n\n*** Employee Role successfully udpated! ***\n')

                                            searchEmploy();


                                        }
                                    );
                                });

                        });
                });
        });
    });
};

const deleteEmploy = () => {
    connection.query(queryEmployChoices, (err, res) => {
        let employChoices = res.map(function (res) {
            return res['employName'];
        });
        prompt([
            {
                type: 'list', name: 'deleteEmploy', message: 'Which employee would you like to remove?',
                choices: employChoices
            }
        ])
            .then((answers) => {
                connection.query(queryEmploysBasic, (err, res) => {
                    if (err) throw err;
                    let fullName = answers.deleteEmploy.split(' ');
                    const employees = res.find(employees => employees.firstName === fullName[0] && employees.lastName === fullName[1]);
                    connection.query(queryDeleteEmploy,
                        {
                            id: employees.id
                        },
                        (err, res) => {
                            if (err) throw err;
                            // console.table(res);
                            console.log('\n\n\n*** Employee successfully removed ***\n')

                            searchEmploy();
                        });
                });
            });
    });
};

const menuFunct = () => {

    prompt(questions)

        .then((answers) => {
            switch (answers.action) {
                case 'View All Employees':
                    searchEmploy();
                    break;

                case 'View All Roles':
                    searchRole();
                    break;

                case 'View All Departments':
                    searchDept();
                    break;

                case 'Add New Employee':
                    addEmploy();
                    break;

                case 'Add New Role':
                    addRole();
                    break;

                case 'Add New Department':
                    addDept();
                    break;

                case 'Update Employee Role':
                    updateEmployRole();
                    break;

                case 'Remove Employee':
                    deleteEmploy();
                    break;

                case 'Finished':
                    connection.end();
                    break;
            }
        });
}

menuFunct();