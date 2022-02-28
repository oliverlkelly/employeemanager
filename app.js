const inquirer = require('inquirer');

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

function init(){
    inquirer.prompt(menu);
}

init();