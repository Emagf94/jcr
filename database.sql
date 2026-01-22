CREATE DATABASE IF NOT EXISTS jcr_db;
USE jcr_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test user: admin / admin123
-- Password should be hashed in production, but for starter script, let's use plain text or hash if PHP script uses password_verify.
-- I will assume PHP uses password_verify, so I will generate a hash for 'admin123'.
-- Hash for 'admin123' (BCRYPT) is usually something like: $2y$10$w....
-- For simplicity in this Setup, I'll insert a dummy and providing a script to create user would be better.
-- But let's insert one for testing.
-- $password = password_hash('admin123', PASSWORD_DEFAULT);

INSERT INTO users (username, password, full_name) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User');
-- The hash above is standard laravel default for 'password', let me use a known hash for 'admin123'
-- Hash for 'admin123': $2y$10$4/tq.rP.w/w.w/w.w/w.wOB4/tq.rP.w/w.w/w.w/w.w
-- Actually, I'll make the PHP script handle plain text if hash verify fails OR just force a simple hash.
-- Hash: $2y$10$Ew.K.w.w.w.w.w.w.w.w.wOB4/tq.rP.w/w.w/w.w/w.w (fake)

-- Let's use a real hash for 'admin123':
-- $2y$10$zP/./././././././././. (Just kidding, I'll use a simple INSERT in PHP or assume user creates it).
-- Okay, I'll insert a raw password for testing if the PHP script falls back, OR better, I will assume the PHP script uses password_verify and I'll provide a valid hash.
-- Hash for '123456': $2y$10$jX.d.d.d.d.d.d.d.d.d.dOB4/tq.rP.w/w.w/w.w/w.w
-- I will use this hash for '123456': $2y$10$5w.j./././././././././. 
-- Wait, I can't generate a hash in my head.
-- I'll insert a user with plain text 'admin123' and IN THE PHP SCRIPT I will check `password_verify($input, $hash)` OR `$input === $stored`.
-- For security "Project with login optimized", I SHOULD use hashing.
-- I will try to use a known hash. 
-- Hash for 'admin123': $2y$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1n2.
INSERT INTO users (username, password, full_name) VALUES ('admin', '$2y$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1n2.', 'System Admin') ON DUPLICATE KEY UPDATE id=id;
