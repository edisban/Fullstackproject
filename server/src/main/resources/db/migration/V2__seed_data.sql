TRUNCATE TABLE students RESTART IDENTITY CASCADE;
TRUNCATE TABLE projects RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

INSERT INTO projects (name, description, created_at) VALUES
    ('project1', 'small', '2025-11-22 13:11:14.84399'),
    ('project2', 'medium', '2025-11-22 13:11:39.936427'),
    ('project3', 'bigg', '2025-11-22 13:11:56.301416'),
    ('project4', 'bigger', '2025-11-22 14:03:23.993621'),
    ('project5', 'normal', '2026-01-27 15:59:43.721709');

INSERT INTO students (code_number, first_name, last_name, date_of_birth, title, description, project_id, created_at) VALUES
    ('131313', 'Jack', 'Sparrow', '1995-08-02', 'Pirate', NULL, (SELECT id FROM projects WHERE name = 'project1'), '2025-11-22 13:13:05.966881'),
    ('141414', 'Christopher', 'Nolan', '1996-09-01', 'Frontend Engineer', 'frontendd', (SELECT id FROM projects WHERE name = 'project2'), '2025-11-22 13:14:37.707111'),
    ('161616', 'Emma', 'Stone', '1990-01-02', 'Backend Engineer', NULL, (SELECT id FROM projects WHERE name = 'project2'), '2025-11-22 14:03:01.802041'),
    ('171717', 'Jim', 'Carrey', '1992-03-03', 'Author', NULL, (SELECT id FROM projects WHERE name = 'project4'), '2025-11-23 10:48:55.512929'),
    ('111111', 'Will', 'Smith', '1997-07-02', 'Frontend', NULL, (SELECT id FROM projects WHERE name = 'project3'), '2025-11-23 16:38:50.491334'),
    ('212121', 'Jim', 'Morrison', '1994-03-02', 'Singer', NULL, (SELECT id FROM projects WHERE name = 'project4'), '2025-11-24 09:35:26.226345'),
    ('515151', 'Daniel', 'Craig', '1981-03-03', 'Actor', NULL, (SELECT id FROM projects WHERE name = 'project2'), '2025-11-24 19:28:18.681368'),
    ('616161', 'Morgan', 'Freeman', '1988-02-12', 'Actor', NULL, (SELECT id FROM projects WHERE name = 'project3'), '2025-11-25 19:11:36.718419'),
    ('181818', 'John', 'Travolta', '1981-12-22', 'Author', NULL, (SELECT id FROM projects WHERE name = 'project1'), '2025-11-28 17:43:50.469486'),
    ('333333', 'Mel', 'Gibson', NULL, 'Actor', NULL, (SELECT id FROM projects WHERE name = 'project2'), '2025-12-06 10:08:18.645215');

INSERT INTO users (username, password, role) VALUES
    ('admin', '$2a$10$PI8WHFtAh3zv2BwKp4d0b.ZsYanXDvQMTDKMZrWXWDxwq/8Fu6Hnu', 'ADMIN'),
    ('user', '$2b$12$8ijy27DHKBOrcVz8nI1p1uLpNWGZfPbfysVnHpAAEHEntlskxR8Dy', 'USER');
