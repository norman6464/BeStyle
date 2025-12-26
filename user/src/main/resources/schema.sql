CREATE TABLE IF NOT EXISTS users (
    id INTEGER(255) AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    icon_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 外部ログイン（Google等）との紐付け用
CREATE TABLE IF NOT EXISTS user_identities (
    id INTEGER(255) AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER(255) NOT NULL,              -- users.id
    provider VARCHAR(20) NOT NULL,        -- 'google', 'github'
    provider_id VARCHAR(255) NOT NULL,    -- 外部サービスの識別子
    UNIQUE(provider, provider_id)
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);