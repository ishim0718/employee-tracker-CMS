-- Active: 1682039566806@@localhost@3306@employee_db
INSERT INTO department (id, name) VALUES 
(1,"Management"),
(2,"Sales"),
(3,"Human Resources"),
(4,"Production");

INSERT INTO roles (id,title,salary) VALUES
(1,"Manager",250000),
(2,"Assistant Manager",180000),
(3,"HR Drone",50000),
(4,"Worker Bee",20000);

INSERT INTO employee (id,first_name,last_name,role_id,manager_id) VALUES
(1,"George","Foreman",1,null),
(2,"James","Garfield",2,1),
(3,"Joe","Madre",3,2),
(4,"Martha","Stewmaker",4,2);