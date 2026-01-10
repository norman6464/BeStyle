-- ==============================================
-- BFF Service Database Schema
-- ==============================================

-- セッション管理テーブル
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id VARCHAR(255) PRIMARY KEY COMMENT 'セッションID（UUID）',
    user_id VARCHAR(255) NOT NULL COMMENT 'ユーザーID（Cognito sub）',
    username VARCHAR(255) NOT NULL COMMENT 'ユーザー名',
    email VARCHAR(255) NOT NULL COMMENT 'メールアドレス',
    access_token TEXT NOT NULL COMMENT 'Cognito アクセストークン',
    refresh_token TEXT NOT NULL COMMENT 'Cognito リフレッシュトークン',
    expires_at TIMESTAMP NOT NULL COMMENT 'アクセストークン有効期限',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
    
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ユーザーセッション管理テーブル';
