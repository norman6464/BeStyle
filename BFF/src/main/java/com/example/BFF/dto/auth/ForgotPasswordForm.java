package com.example.BFF.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * パスワードリセット確認フォーム
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForgotPasswordForm {
    
    /**
     * メールアドレス
     */
    private String email;
    
    /**
     * 確認コード
     */
    private String code;
    
    /**
     * 新しいパスワード
     */
    private String newPassword;
}
