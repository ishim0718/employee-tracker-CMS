const inquirer = require('inquirer');
const cTable = require('console.table');
const fs = require('fs');

inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'task',
            choices: [
                'View All Employees', 
                'Add Employees', 
                'Update Employee Role', 
                'View All Roles', 
                'Add Role', 
                'View All Departments', 
                'Add Department', 
                'Quit'
            ],
        }
    ])
    .then(answers => {
        if (answers.task === "View all employees") {
          viewEmployees();
        };
        
        if (answers.task === "Add an employee") {
          addEmployee();
        };
    
        if (answers.task === "Update an employee role") {
          updateEmployeeRole();
        };

        if (answers.task === "View all roles") {
          viewRoles();
        };
        
        if (answers.task === "Add a role") {
          addRole();
        };
    
        if (answers.task === "View all departments") {
          viewDepartments();
        };
    
        if (answers.task === "Add a department") {
          addDepartment();
        };
    
        if (answers.task === "Update an employee's manager") {
          updateEmployeeManager();
        };
    
        if (answers.task === "View employees by manager") {
          viewByManager();
        };
    
        if (answers.task === "View employees by department") {
          viewByDepartment();
        };
        
        if (answers.task === "Remove employee") {
          removeEmployee();
        };

        if (answers.task === "Remove role") {
          removeRole();
        };
    
        if (answers.task === "Remove department") {
          removeDepartment();
        };
    
        if (answers.task === "Exit") {
          process.exit();
        };
    });

    const viewEmployees = () => {
        const sql = `SELECT employees.id, 
                      employees.first_name, 
                      employees.last_name,
                      roles.title AS title,
                      roles.salary AS salary,
                      departments.name AS department,
                      CONCAT (manager.first_name, " ", manager.last_name) AS manager 
                FROM employees
                LEFT JOIN roles ON employees.role_id = roles.id
                LEFT JOIN departments ON roles.department_id = departments.id
                LEFT JOIN employees manager ON employees.manager_id = manager.id`;
        db.query(sql, (err, rows) => {
            if (err) {
            throw err;
            }
            console.log("\n");
            console.table(rows);
            return startInquirer();
        });
    };

    const addEmployee = () => {
        return inquirer.prompt([
            {
              type: "input",
              name: "firstName",
              message: "Employee first name",
              validate: nameInput => {
                if (nameInput) {
                  return true;
                } else {
                  console.log("Please enter a name");
                  return false;
                };
              }
            },
            {
              type: "input",
              name: "lastName",
              message: "Employee last name",
              validate: nameInput => {
                if (nameInput) {
                  return true;
                } else {
                  console.log("Please enter a name");
                  return false;
                };
              }
            }
          ])
          .then (answer => {
            const params = [answer.firstName, answer.lastName];
            const sql = `SELECT * FROM roles`;
            db.query(sql, (err, rows) => {
              if (err) {
                throw err;
              }
              const roles = rows.map(({title, id}) => ({name: title, value: id}));
              inquirer.prompt([
                {
                  type: "list",
                  name: "role",
                  message: "Employee role",
                  choices: roles
                }
              ])
              .then(roleAnswer => {
                const role = roleAnswer.role;
                params.push(role);
                const sql = `SELECT * FROM employees`;
                db.query(sql, (err, rows) => {
                  if (err) {
                    throw err;
                  }
                  const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
                  managers.push({name: "No manager", value: null});
                  inquirer.prompt([
                    {
                      type: "list",
                      name: "manager",
                      message: "Employee manager",
                      choices: managers
                    }
                  ])
                  .then(managerAnswer => {
                    const manager = managerAnswer.manager;
                    params.push(manager);
                    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;
                    db.query(sql, params, (err) => {
                      if (err) {
                        throw err;
                      }
                      console.log("Employee added");
                      return viewEmployees();
                        });
                    });
                });
            });
        });
    });
};

        const updateEmployeeManager = () => {
            const sql = `SELECT first_name, last_name, id FROM employees`
            db.query(sql, (err, rows) => {
              if (err) {
                throw err;
              }
              const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
              inquirer.prompt([
                {
                  type: "list",
                  name: "employee",
                  message: "Which employee would you like to update?",
                  choices: employees
                }
              ])
              .then(employeeAnswer => {
                const employee = employeeAnswer.employee;
                const params = [employee];
                const sql = `SELECT first_name, last_name, id FROM employees`;
                db.query(sql, (err, rows) => {
                  if (err) {
                    throw err;
                  }
                  const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
                  managers.push({name: "No manager", value: null});
                  inquirer.prompt([
                    {
                      type: "list",
                      name: "manager",
                      message: "Who is this employee's new manager?",
                      choices: managers
                    }
                  ])
                  .then(managerAnswer => {
                    const manager = managerAnswer.manager;
                    params.unshift(manager);
                    const sql = `UPDATE employees
                                  SET manager_id = ?
                                  WHERE id = ?`
                    db.query(sql, params, (err) => {
                      if (err) {
                        throw err;
                      }
                      console.log("Employee updated");
                      return viewEmployees();
                    });
                  });
                });
              });
            });
        };
          

