package com.example.BFF.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * サインアップフォーム
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupForm {
    
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
    private String name;
}
