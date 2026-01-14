
-- ============================================
-- User Service - schema.sql
-- データベース名: user_db
-- ============================================

-- ユーザー基本情報
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cognito_sub VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(50) NOT NULL,
    bio TEXT,
    profile_image_url VARCHAR(500),
    header_image_url VARCHAR(500),
    location VARCHAR(100),
    website_url VARCHAR(200),
    birth_date DATE,
    is_private BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ユーザー統計（非正規化）
CREATE TABLE IF NOT EXISTS user_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_count INT DEFAULT 0,
    follower_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ユーザー設定
CREATE TABLE IF NOT EXISTS user_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    language VARCHAR(10) DEFAULT 'ja',
    timezone VARCHAR(50) DEFAULT 'Asia/Tokyo',
    email_notification_enabled BOOLEAN DEFAULT TRUE,
    push_notification_enabled BOOLEAN DEFAULT TRUE,
    dm_permission VARCHAR(20) DEFAULT 'EVERYONE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ブロック関係
CREATE TABLE IF NOT EXISTS user_blocks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    blocker_id INT NOT NULL,
    blocked_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (blocker_id, blocked_id),
    FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ミュート関係
CREATE TABLE IF NOT EXISTS user_mutes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    muter_id INT NOT NULL,
    muted_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (muter_id, muted_id),
    FOREIGN KEY (muter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (muted_id) REFERENCES users(id) ON DELETE CASCADE
);