INSERT INTO department (name) VALUES -- Insert values into the 'department' table
('Sales'),
('Engineering'),
('Finance');

INSERT INTO role (title, salary, department_id) VALUES -- Insert values into the 'role' table
('Salesperson', 50000, 1),
('Engineer', 70000, 2),
('Accountant', 60000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES -- Insert values into the 'employee' table
('Amy', 'Davis', 1, NULL),
('Bill', 'Brown', 2, NULL),
('Justin', 'Mitchell', 3, NULL),
('Mya', 'Reeves', 2, 2);