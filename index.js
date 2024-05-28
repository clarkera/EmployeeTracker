const inquirer = require('inquirer'); // Import the inquirer module for interactive command line user interfaces
const connectDb = require('./db/connection'); // Import the connectDb function from the db/connection module

let db; // Initialize the database connection variable

const startApp = () => { // Function to start the application and prompt the user for an action
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'Choose an action:',
        choices: [
            'View All Departments', 
            'View All Roles', 
            'View All Employees', 
            'Add a Department', 
            'Add a Role', 
            'Add an Employee', 
            'Update an Employee Role', 
            'Exit'
        ]
    }]).then((response) => {
        handleUserSelection(response.action); // Handle the user's selection
    });
};

const handleUserSelection = (action) => { // Function to handle the user's selection
    db = connectDb();
    if (action === 'View All Departments') {
        viewDepartments();
    } else if (action === 'View All Roles') {
        viewRoles();
    } else if (action === 'View All Employees') {
        viewEmployees();
    } else if (action === 'Add a Department') {
        addDepartment();
    } else if (action === 'Add a Role') {
        addRole();
    } else if (action === 'Add an Employee') {
        addEmployee();
    } else if (action === 'Update an Employee Role') {
        updateEmployeeRole();
    } else if (action === 'Exit') { // End the database connection and exit the application
        db.end();
        console.log("Goodbye!");
    } else {
        console.log("Invalid action!"); // Handle invalid action
        startApp();
    }
};

const viewDepartments = () => { // Function to view all departments
    db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;
        console.table(result.rows);  // Display the results in a table format
        startApp();
    });
};

const viewRoles = () => { // Function to view all roles
    const query = `
        SELECT role.id, role.title, department.name AS department, role.salary 
        FROM role 
        JOIN department ON role.department_id = department.id`;
    db.query(query, (err, result) => {
        if (err) throw err;
        console.table(result.rows);
        startApp();
    });
};

const viewEmployees = () => { // Function to view all employees
    const query = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM employee 
        JOIN role ON employee.role_id = role.id 
        JOIN department ON role.department_id = department.id 
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id`;
    db.query(query, (err, result) => {
        if (err) throw err;
        console.table(result.rows);
        startApp();
    });
};

const addDepartment = () => { // Function to add a new department
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the new department name:',
            validate: input => input ? true : 'Department name cannot be empty!'
        }
    ]).then((response) => {
        db.query(`INSERT INTO department (name) VALUES ($1)`, [response.name], (err, result) => {
            if (err) throw err;
            console.log(`Department ${response.name} added!`);
            startApp();
        });
    });
};

const addRole = () => { // Function to add a new role
    db.query(`SELECT * FROM department`, (err, result) => { // Query the departments to display choices to the user
        if (err) throw err;

        const departmentChoices = result.rows.map(department => ({
            name: department.name,
            value: department.id
        }));

        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the role title:',
                validate: input => input ? true : 'Role title cannot be empty!'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the role salary:',
                validate: input => !isNaN(input) ? true : 'Salary must be a number!'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department for this role:',
                choices: departmentChoices
            }
        ]).then((response) => {
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`, 
                [response.title, response.salary, response.department_id], (err, result) => {
                    if (err) throw err;
                    console.log(`Role ${response.title} added!`);
                    startApp();
                }
            );
        });
    });
};

const addEmployee = () => { // Function to add a new employee
    db.query(`SELECT * FROM role`, (err, roles) => {
        if (err) throw err;

        const roleChoices = roles.rows.map(role => ({
            name: role.title,
            value: role.id
        }));

        db.query(`SELECT * FROM employee`, (err, employees) => {
            if (err) throw err;

            const managerChoices = employees.rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }));
            managerChoices.push({ name: 'None', value: null });

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Enter the employee\'s first name:',
                    validate: input => input ? true : 'First name cannot be empty!'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Enter the employee\'s last name:',
                    validate: input => input ? true : 'Last name cannot be empty!'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the employee\'s role:',
                    choices: roleChoices
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Select the employee\'s manager:',
                    choices: managerChoices
                }
            ]).then((response) => {
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, 
                    [response.first_name, response.last_name, response.role_id, response.manager_id], (err, result) => {
                        if (err) throw err;
                        console.log(`Employee ${response.first_name} ${response.last_name} added!`);
                        startApp();
                    }
                );
            });
        });
    });
};

const updateEmployeeRole = () => { // Function to update an employee's role
    db.query(`SELECT * FROM employee`, (err, employees) => {
        if (err) throw err;

        const employeeChoices = employees.rows.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }));

        db.query(`SELECT * FROM role`, (err, roles) => {
            if (err) throw err;

            const roleChoices = roles.rows.map(role => ({
                name: role.title,
                value: role.id
            }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: 'Select the employee to update:',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the new role for the employee:',
                    choices: roleChoices
                }
            ]).then((response) => {
                db.query(`UPDATE employee SET role_id = $1 WHERE id = $2`, 
                    [response.role_id, response.employee_id], (err, result) => {
                        if (err) throw err;
                        console.log('Employee role updated!');
                        startApp();
                    }
                );
            });
        });
    });
};

startApp(); // Start the application