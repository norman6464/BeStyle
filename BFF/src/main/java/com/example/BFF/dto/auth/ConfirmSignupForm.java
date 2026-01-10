package com.example.BFF.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * サインアップ確認フォーム
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfirmSignupForm {
    
    /**
     * メールアドレス
     */
    private String email;
    
    /**
     * 確認コード
     */
    private String code;
}
