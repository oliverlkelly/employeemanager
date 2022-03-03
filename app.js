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



async function menuFunct(){
    const menuChoice = await inquirer.prompt(menu);
    switch(menuChoice){
        case 'View All Employees':
            
            break;
        case 'Add New Employee':
            
            break;
        case 'Update Employee Role':
            
            break;
        case 'Remove Employee':
            
            break;
        case 'View All Roles':
            
            break;
        case 'Add New Role':
            
            break;
        case 'View All Departments':
            
            break;
        case 'Add New Department':
            
            break;
        case 'Finished':
            done = true;
            break;
    }
}

function init(){
    menuFunct();
}

init();