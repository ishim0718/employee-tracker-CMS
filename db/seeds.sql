-- Active: 1682039566806@@localhost@3306@employee_db
INSERT INTO departments (id, name) VALUES 
(1,"Management"),
(2,"Sales"),
(3,"Human Resources"),
(4,"Production");

INSERT INTO roles (id,title,salary,department_id) VALUES
(1,"Manager",250000,1),
(2,"Assistant Manager",180000,1),
(3,"HR Drone",50000,3),
(4,"Worker Bee",20000,4);

INSERT INTO employees (id,first_name,last_name,role_id,manager_id) VALUES
(1,"George","Foreman",1,null),
(2,"James","Garfield",2,1),
(3,"Joe","Madre",3,2),
(4,"Martha","Stewmaker",4,2);