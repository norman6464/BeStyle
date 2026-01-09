CREATE TABLE IF NOT EXISTS user_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) PRIMARY KEY,      -- userサービスのユーザーIDを参照
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expiry_date TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;