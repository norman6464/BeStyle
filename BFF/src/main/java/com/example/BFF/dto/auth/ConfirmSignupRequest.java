package com.example.BFF.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * サインアップ確認リクエストDTO
 * メール認証コードによる確認
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfirmSignupRequest {
    
    /**
     * ユーザー名
     */
    private String username;
    
    /**
     * 確認コード（メールで受け取ったコード）
     */
    private String confirmationCode;
}
