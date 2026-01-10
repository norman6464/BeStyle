package com.example.BFF.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * サインアップリクエストDTO
 * 新規ユーザー登録情報
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequest {
    
    /**
     * ユーザー名
     */
    private String username;
    
    /**
     * メールアドレス
     */
    private String email;
    
    /**
     * パスワード
     */
    private String password;
    
    /**
     * 表示名
     */
    private String displayName;
}
