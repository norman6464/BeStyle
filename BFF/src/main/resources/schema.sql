-- ============================================
-- BFF Service - Schema
-- ============================================

-- user_tokens: トークン保存用テーブル（後方互換性のため残す）
CREATE TABLE IF NOT EXISTS user_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,      -- userサービスのユーザーIDを参照
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expiry_date TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- user_sessions: セッション管理用テーブル（httpOnly Cookie用）
-- アクセストークンはこのテーブルに保存し、Cookieにはsession_idのみを保存
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(128) NOT NULL UNIQUE,  -- httpOnly CookieにセットするセッションID
    user_id INT NOT NULL,                      -- userサービスのユーザーID
    cognito_sub VARCHAR(255) NOT NULL,         -- CognitoのユーザーSub
    access_token TEXT NOT NULL,                -- アクセストークン
    refresh_token TEXT,                        -- リフレッシュトークン
    id_token TEXT,                             -- IDトークン
    expires_at TIMESTAMP NOT NULL,             -- セッション有効期限
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
