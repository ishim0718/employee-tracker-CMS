const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
  },
  console.log(`Connected to the employee_db database.`)
);

function startInquirer() {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'task',
        choices: [
          'View All Employees',
          'Add Employee',
          'Update Employee Role',
          'Update Employee Manager',
          'View All Roles',
          'Add Role',
          'View All Departments',
          'Add Department',
          'Remove Employee',
          'Remove Role',
          'Remove Department',
          'Exit'
        ],
      }
    ])
    .then(answers => {
      if (answers.task === "View All Employees") {
        viewEmployees();
      };

      if (answers.task === "Add Employee") {
        addEmployee();
      };

      if (answers.task === "Update Employee Role") {
        updateEmployeeRole();
      };

      if (answers.task === "View All Roles") {
        viewRoles();
      };

      if (answers.task === "Add Role") {
        addRole();
      };

      if (answers.task === "View All Departments") {
        viewDepartments();
      };

      if (answers.task === "Add Department") {
        addDepartment();
      };

      if (answers.task === "Update Employee Manager") {
        updateEmployeeManager();
      };

      if (answers.task === "View Employees By Manager") {
        viewByManager();
      };

      if (answers.task === "View Employees By Department") {
        viewByDepartment();
      };

      if (answers.task === "Remove Employee") {
        removeEmployee();
      };

      if (answers.task === "Remove Role") {
        removeRole();
      };

      if (answers.task === "Remove Department") {
        removeDepartment();
      };

      if (answers.task === "Exit") {
        process.exit();
      };
    });
};

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
    console.table(rows);
    startInquirer();
  })
};

const addEmployee = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "Employee first name",
    },
    {
      type: "input",
      name: "lastName",
      message: "Employee last name",
    }
  ])
    .then(answer => {
      const params = [answer.firstName, answer.lastName];
      const sql = `SELECT * FROM roles`;
      db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }
        const roles = rows.map(({ title, id }) => ({ name: title, value: id }));
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
              const managers = rows.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
              managers.push({ name: "No manager", value: null });
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
                    console.log("\n");
                    console.log("Employee added");
                    console.log("\n");
                    return viewEmployees();
                  });
                  startInquirer();
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
    const employees = rows.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
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
          const managers = rows.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
          managers.push({ name: "No manager", value: null });
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
              startInquirer();
            });
        });
      });
  });
};

const viewRoles = () => {
  const sql = `SELECT roles.id, 
                      roles.title, 
                      roles.salary,
                      departments.name AS department
                FROM roles
                LEFT JOIN departments ON roles.department_id = departments.id`;
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    console.table(rows);
    startInquirer();
  })
};

const addRole = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "New role title",
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter a title");
          return false;
        };
      }
    },
    {
      type: "input",
      name: "salary",
      message: "New role salary",
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter a salary");
          return false;
        };
      }
    }
  ])
    .then(answer => {
      const params = [answer.title, answer.salary];
      const sql = `SELECT * FROM departments`;
      db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }
        const departments = rows.map(({ name, id }) => ({ name: name, value: id }));
        inquirer.prompt([
          {
            type: "list",
            name: "department",
            message: "New Role Department",
            choices: departments
          }
        ])
          .then(answer => {
            const department = answer.department;
            params.push(department);
            const sql = `SELECT * FROM roles`;
            db.query(sql, (err, rows) => {
              if (err) {
                throw err;
              }
              const sql = `INSERT INTO roles (title, salary, department_id)
                      VALUES (?, ?, ?)`
              db.query(sql, params, (err) => {
                if (err) {
                  throw err;
                }
                console.log("Role added");
                return viewRoles();
              });
              startInquirer();
            });
          });
      });
    });
};

const viewDepartments = () => {
  const sql = `SELECT departments.id, 
                          departments.name 
                    FROM departments`;
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    console.table(rows);
    startInquirer();
  })
};

const addDepartment = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "New Deparment name",
    }
  ])
    .then(answer => {
      const params = answer.name;
      const sql = `INSERT INTO departments (name)
                  VALUES (?)`;
      db.query(sql, params, (err, rows) => {
        if (err) {
          throw err;
        }
        console.log("Department added");
        return viewDepartments();
      })
      startInquirer();
    });
};

const removeEmployee = () => {
  const sql = `SELECT first_name, last_name, id FROM employees`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const employees = rows.map(({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }));
    return inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee would you like to remove?",
        choices: employees
      }
    ])
      .then(answer => {
        const employee = answer.employee;
        const params = [employee];
        const sql = `DELETE FROM employees
                            WHERE id = ?`
        db.query(sql, params, (err) => {
          if (err) {
            throw err;
          }
          console.log("Employee removed");
          return viewEmployees();
        });
        startInquirer();
      });
  });
};

const removeRole = () => {
  const sql = `SELECT title, id FROM roles`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const roles = rows.map(({ title, id }) => ({ name: title, value: id }));
    return inquirer.prompt([
      {
        type: "list",
        name: "role",
        message: "Which role would you like to remove?",
        choices: roles
      }
    ])
      .then(answer => {
        const role = answer.role;
        const params = [role];
        const sql = `DELETE FROM roles
                            WHERE id = ?`
        db.query(sql, params, (err) => {
          if (err) {
            throw err;
          }
          console.log("Role removed");
          return viewRoles();
        });
        startInquirer();
      });
  });
};

const removeDepartment = () => {
  const sql = `SELECT name, id FROM departments`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const departments = rows.map(({ name, id }) => ({ name: name, value: id }));
    return inquirer.prompt([
      {
        type: "list",
        name: "department",
        message: "Which department would you like to remove?",
        choices: departments
      }
    ])
      .then(answer => {
        const department = answer.department;
        const params = [department];
        const sql = `DELETE FROM departments
                            WHERE id = ?`
        db.query(sql, params, (err) => {
          if (err) {
            throw err;
          }
          console.log("Department removed");
          return viewDepartments();
        });
        startInquirer();
      });
  });
};

startInquirer();