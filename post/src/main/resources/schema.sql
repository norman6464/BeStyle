
-- 投稿テーブル
-- ============================================
-- Post Service - schema.sql
-- データベース名: post_db
-- ============================================

-- 投稿
CREATE TABLE IF NOT EXISTS posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT,
    reply_to_id INT,
    repost_of_id INT,
    quote_of_id INT,
    visibility VARCHAR(20) DEFAULT 'PUBLIC',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reply_to_id) REFERENCES posts(id) ON DELETE SET NULL,
    FOREIGN KEY (repost_of_id) REFERENCES posts(id) ON DELETE SET NULL,
    FOREIGN KEY (quote_of_id) REFERENCES posts(id) ON DELETE SET NULL
);

-- 投稿統計（非正規化）
CREATE TABLE IF NOT EXISTS post_stats (
    post_id INT PRIMARY KEY,
    like_count INT DEFAULT 0,
    reply_count INT DEFAULT 0,
    repost_count INT DEFAULT 0,
    quote_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- 投稿メディア
CREATE TABLE IF NOT EXISTS post_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    media_type VARCHAR(20) NOT NULL,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    width INT,
    height INT,
    duration_seconds INT,
    alt_text VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- ハッシュタグ
CREATE TABLE IF NOT EXISTS hashtags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    post_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 投稿とハッシュタグの中間
CREATE TABLE IF NOT EXISTS post_hashtags (
    post_id INT NOT NULL,
    hashtag_id INT NOT NULL,
    PRIMARY KEY (post_id, hashtag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (hashtag_id) REFERENCES hashtags(id) ON DELETE CASCADE
);

-- いいね
CREATE TABLE IF NOT EXISTS post_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- ブックマーク
CREATE TABLE IF NOT EXISTS post_bookmarks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- メンション
CREATE TABLE IF NOT EXISTS post_mentions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    mentioned_user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (post_id, mentioned_user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);