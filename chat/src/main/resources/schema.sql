-- ルーム管理
CREATE TABLE IF NOT EXISTS rooms (
    id BINARY(16) PRIMARY KEY,            -- UUID推奨
    name VARCHAR(100),
    is_group BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ルーム参加者（Messagingの役割）
CREATE TABLE IF NOT EXISTS room_members (
    room_id BINARY(16) NOT NULL,
    user_id BIGINT NOT NULL,              -- user-serviceのID
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (room_id, user_id)
);

-- チャット履歴（Historyの役割）
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BINARY(16) NOT NULL,
    sender_id BIGINT NOT NULL,            -- user-serviceのID
    content TEXT NOT NULL,
    message_type ENUM('TEXT', 'IMAGE', 'AI') DEFAULT 'TEXT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);