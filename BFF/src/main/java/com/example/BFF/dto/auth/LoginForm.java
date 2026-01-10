package com.example.BFF.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ログインフォーム
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginForm {
    
    /**
     * メールアドレス
     */
    private String email;
    
    /**
     * パスワード
     */
    private String password;
}
