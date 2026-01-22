-- 1. Map existing roles to new roles
UPDATE users SET role = 'owner' WHERE role = 'admin';
UPDATE users SET role = 'mechanic' WHERE role = 'employee';

-- 2. Modify the column definition
ALTER TABLE users MODIFY COLUMN role ENUM('developer', 'owner', 'mechanic') DEFAULT 'mechanic';
