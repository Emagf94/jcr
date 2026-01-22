ALTER TABLE users ADD COLUMN role ENUM('developer', 'admin', 'employee') DEFAULT 'employee';
ALTER TABLE users ADD COLUMN status TINYINT(1) DEFAULT 1; -- 1: active, 0: inactive

-- Create or Update the Developer User
-- Let's make sure our current 'admin' is the developer
UPDATE users SET role = 'developer', full_name = 'Desarrollador Principal' WHERE username = 'admin';

-- Insert if not exists (in case user deleted admin)
INSERT INTO users (username, password, full_name, role, status)
SELECT 'dev', '$2y$10$hAOfmulJn63mwpWt5nikMOQOQi8LjDfpCQtxsP4u3YVQIa97VvXsi', 'Desarrollador', 'developer', 1
WHERE NOT EXISTS (SELECT 1 FROM users WHERE role = 'developer');
