package com.example.BFF.dto.auth;

import com.example.BFF.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 現在のユーザー情報レスポンス
 * /auth/me エンドポイントで返す
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurrentUserResponse {
    
    /**
     * 認証されているかどうか
     */
    private boolean authenticated;
    
    /**
     * ユーザー情報
     */
    private UserDto user;
    
    /**
     * 認証済みレスポンスを作成
     */
    public static CurrentUserResponse authenticated(UserDto user) {
        return CurrentUserResponse.builder()
                .authenticated(true)
                .user(user)
                .build();
    }
    
    /**
     * 未認証レスポンスを作成
     */
    public static CurrentUserResponse notAuthenticated() {
        return CurrentUserResponse.builder()
                .authenticated(false)
                .user(null)
                .build();
    }
}
