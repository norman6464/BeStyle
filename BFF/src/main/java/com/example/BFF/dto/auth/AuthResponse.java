package com.example.BFF.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 認証レスポンスDTO
 * 認証結果をフロントエンドに返す
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    
    /**
     * 認証成功かどうか
     */
    private boolean success;
    
    /**
     * メッセージ
     */
    private String message;
    
    /**
     * ユーザーID（認証成功時）
     */
    private Integer userId;
    
    /**
     * ユーザー名（認証成功時）
     */
    private String username;
    
    /**
     * メールアドレス（認証成功時）
     */
    private String email;
    
    /**
     * 表示名（認証成功時）
     */
    private String displayName;

    /**
     * 成功レスポンスを作成
     */
    public static AuthResponse success(Integer userId, String username, String email, String displayName) {
        return AuthResponse.builder()
                .success(true)
                .message("認証に成功しました")
                .userId(userId)
                .username(username)
                .email(email)
                .displayName(displayName)
                .build();
    }

    /**
     * エラーレスポンスを作成
     */
    public static AuthResponse error(String message) {
        return AuthResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
