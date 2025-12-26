CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER(255) PRIMARY KEY,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS room_members (
    room_id INTEGER(255) NOT NULL,
    user_id INTEGER(255) NOT NULL, 
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (room_id, user_id),
    -- 同一DB内なので外部キーを張る
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER(255) AUTO_INCREMENT PRIMARY KEY,
    room_id INTEGER(255) NOT NULL,
    sender_id INTEGER(255) NOT NULL, -- userサービスのid
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- ルームが消えたらメッセージも消えるように連動させる
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;