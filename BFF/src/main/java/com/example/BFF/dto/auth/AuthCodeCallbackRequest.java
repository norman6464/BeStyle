package com.example.BFF.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 認証コードコールバックリクエストDTO
 * フロントエンドからCognitoの認証コードを受け取る
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthCodeCallbackRequest {
    
    /**
     * Cognitoから受け取った認証コード
     */
    private String code;
    
    /**
     * CSRF対策用のstate値
     */
    private String state;
}
