var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "yIHYLPSIPPYP1!",
    database: "employee_db"
});

connection.connect(function(err) {
    if (err) throw err;
    // Start application on connection
    start();
});



function start() {
    const query = "SELECT employee.id, first_name, last_name, title, department.name AS department, salary FROM role JOIN employee ON role.id = employee.role_id JOIN department ON department.id = role.department_id";
    connection.query(query, function(err, res) {
        if (err)
            throw err;
        console.table(res);
    });

    inquirer
        .prompt({
            name: "options",
            type: "list",
            choices: ["Add Department", "Add Role", "Add Employee", "View Departments", "View Roles", "View Employees", "Update Employee Roles", "Exit"],
            message: "What would you like to do?",
            loop: false
        })
        .then(function(answer) {
            if (answer.options === "Add Department") {
                addDepartment();
            } else if (answer.options === "Add Role") {
                addRole();
            } else if (answer.options === "Add Employee") {
                addEmployee();
            } else if (answer.options === "View Departments") {
                viewDepartments();
            } else if (answer.options === "View Roles") {
                viewRoles();
            } else if (answer.options === "View Employees") {
                viewEmployees();
            } else if (answer.options === "Update Employee Roles") {
                updateRole();
            } else {
                console.log("See you later!");
                connection.end();
            }
        })
}

function addDepartment() {

    inquirer
        .prompt({
            name: "newDepartment",
            type: "input",
            message: "What department would you like to add?"
        })
        .then(function(answer) {
            connection.query("INSERT INTO department SET ?", {
                    name: answer.newDepartment
                },
                function(err) {
                    if (err) throw err;
                    console.log("You succesfully added a new department!");
                    // restart options menu
                    start();
                }
            )
        })
}

function addRole() {

    inquirer
        .prompt([{
            name: "newRole",
            type: "input",
            message: "What role would you like to add?"
        }, {
            name: "newSalary",
            type: "input",
            message: "What is the salary of this new role?"
        }, {
            name: "roleDepartment",
            type: "list",
            choices: ["Sales", "Engineering", "Finance", "Legal"],
            message: "What department does this role belong to?"
        }])
        .then(function(answer) {
            switch (answer.roleDepartment) {
                case "Sales":
                    answer.roleDepartment = 1;
                    break;
                case "Engineering":
                    answer.roleDepartment = 2;
                    break;
                case "Finance":
                    answer.roleDepartment = 3;
                    break;
                case "Legal":
                    answer.roleDepartment = 4;
                    break;
            }

            connection.query("INSERT INTO role SET ?", {
                    title: answer.newRole,
                    salary: answer.newSalary,
                    department_id: answer.roleDepartment
                },
                function(err) {
                    if (err) throw err;
                    console.log("You succesfully added a new role!");
                    // restart options menu
                    start();
                }
            )
        })
}

function addEmployee() {

    connection.query("Select * FROM role")

    inquirer
        .prompt([{
            name: "firstName",
            type: "input",
            message: "What is your employees first name?"
        }, {
            name: "lastName",
            type: "input",
            message: "What is your employees last name?"
        }, {
            name: "employeeRole",
            type: "list",
            choices: ["Sales Lead", "Salesperson", "Lead Engineering", "Software Engineer", "Accountant", "Legal Team Lead", "Lawyer"],
            loop: false,
            message: "What role does this employee have?"
        }])
        .then(function(answer) {
            switch (answer.employeeRole) {
                case "Sales Lead":
                    answer.employeeRole = 1;
                    break;
                case "Salesperson":
                    answer.employeeRole = 2;
                    break;
                case "Lead Engineering":
                    answer.employeeRole = 3;
                    break;
                case "Software Engineer":
                    answer.employeeRole = 4;
                    break;
                case "Accountant":
                    answer.employeeRole = 5;
                    break;
                case "Legal Team Lead":
                    answer.employeeRole = 6;
                    break;
                case "Lawyer":
                    answer.employeeRole = 7;
                    break;
            }
            connection.query("INSERT INTO employee SET ?", {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.employeeRole
                },
                function(err) {
                    if (err) throw err;
                    console.log("You succesfully added a new employee!");
                    // restart options menu
                    start();
                }
            )
        })
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        console.table(res);
    })

    inquirer
        .prompt({
            name: "next",
            type: "list",
            choices: ["Back", "Exit"],
            message: "What would you like to do next?"
        })
        .then(function(answer) {
            if (answer.next === "Back") {
                start();
            } else {
                console.log("See you later!");
                connection.end();
            }
        })
}

function viewRoles() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        console.table(res);
    })
    inquirer
        .prompt({
            name: "next",
            type: "list",
            choices: ["Back", "Exit"],
            message: "What would you like to do next?"
        })
        .then(function(answer) {
            if (answer.next === "Back") {
                start();
            } else {
                console.log("See you later!");
                connection.end();
            }
        })
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        console.table(res);
    })
    inquirer
        .prompt({
            name: "next",
            type: "list",
            choices: ["Back", "Exit"],
            message: "What would you like to do next?"
        })
        .then(function(answer) {
            if (answer.next === "Back") {
                start();
            } else {
                console.log("See you later!");
                connection.end();
            }
        })
}

function updateRole() {
    inquirer
        .prompt([{
            name: "roleToChange",
            type: "list",
            choices: ["Sales Lead", "Salesperson", "Lead Engineering", "Software Engineer", "Accountant", "Legal Team Lead", "Lawyer"],
            message: "Which role would you like to update?"
        }, {
            name: "newTitle",
            type: "input",
            message: "What would you like to make the new title of this role?",
        }, {
            name: "newSalary",
            type: "number",
            message: "What would you like to change the salary to?"
        }])
        .then(function(answer) {
            switch (answer.roleToChange) {
                case "Sales Lead":
                    answer.roleToChange = 1;
                    break;
                case "Salesperson":
                    answer.roleToChange = 2;
                    break;
                case "Lead Engineering":
                    answer.roleToChange = 3;
                    break;
                case "Software Engineer":
                    answer.roleToChange = 4;
                    break;
                case "Accountant":
                    answer.roleToChange = 5;
                    break;
                case "Legal Team Lead":
                    answer.roleToChange = 6;
                    break;
                case "Lawyer":
                    answer.roleToChange = 7;
                    break;
            }

            connection.query("UPDATE role SET ? WHERE ?", [{
                    title: answer.newTitle,
                    salary: answer.newSalary
                }, {
                    id: answer.roleToChange
                }],
                function(err) {
                    if (err) throw err;
                    console.log("You succesfully changed a role!");
                    // restart options menu
                    start();
                }
            )
        })
}