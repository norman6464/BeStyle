package com.example.BFF.util;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * JWTトークン処理用のユーティリティクラス
 */
@Component
public class JwtTokenUtil {

    /**
     * 現在の認証情報からJWTトークンを取得
     */
    public Optional<Jwt> getCurrentJwt() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return Optional.of(jwtAuth.getToken());
        }
        
        return Optional.empty();
    }

    /**
     * 現在のユーザーID（Cognito Sub）を取得
     */
    public Optional<String> getCurrentUserId() {
        return getCurrentJwt()
                .map(jwt -> jwt.getClaimAsString("sub"));
    }

    /**
     * 現在のユーザー名（Cognito Username）を取得
     */
    public Optional<String> getCurrentUsername() {
        return getCurrentJwt()
                .map(jwt -> jwt.getClaimAsString("cognito:username"))
                .or(() -> getCurrentJwt().map(jwt -> jwt.getSubject()));
    }

    /**
     * 現在のメールアドレスを取得
     */
    public Optional<String> getCurrentEmail() {
        return getCurrentJwt()
                .map(jwt -> jwt.getClaimAsString("email"));
    }

    /**
     * JWTトークンの生の文字列を取得（他のサービスへ転送用）
     */
    public Optional<String> getCurrentJwtTokenString() {
        return getCurrentJwt()
                .map(Jwt::getTokenValue);
    }

    /**
     * クレームから値を取得
     */
    public <T> Optional<T> getClaim(String claimName, Class<T> claimType) {
        return getCurrentJwt()
                .map(jwt -> jwt.getClaim(claimName))
                .filter(claimType::isInstance)
                .map(claimType::cast);
    }
}
