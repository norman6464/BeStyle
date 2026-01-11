package com.example.BFF.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ログインリクエストDTO
 * フロントエンドから受け取るログイン情報
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {
    
    /**
     * ユーザー名またはメールアドレス
     */
    private String username;
    
    /**
     * パスワード
     */
    private String password;
}
