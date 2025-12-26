CREATE TABLE IF NOT EXISTS user_tokens (
    user_id VARCHAR(255) PRIMARY KEY,      -- サブジェクト識別子（Googleのsubなど）
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expiry_date TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);