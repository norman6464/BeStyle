package com.example.BFF.util;

import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;

import java.text.ParseException;
import java.util.Optional;

/**
 * JWTユーティリティクラス
 * JWTトークンのデコードとクレーム取得
 */
@Slf4j
public class JwtUtils {

    private JwtUtils() {
        // ユーティリティクラスなのでインスタンス化を禁止
    }

    /**
     * JWTトークンをデコードしてクレームセットを取得
     * 
     * @param token JWTトークン
     * @return クレームセット（デコードに失敗した場合はEmpty）
     */
    public static Optional<JWTClaimsSet> decode(String token) {
        if (token == null || token.isEmpty()) {
            log.warn("JWTトークンがnullまたは空です");
            return Optional.empty();
        }

        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            return Optional.of(claims);
        } catch (ParseException e) {
            log.error("JWTトークンのパースに失敗しました: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * JWTトークンからsubject（ユーザーID）を取得
     * 
     * @param token JWTトークン
     * @return subject（取得に失敗した場合はEmpty）
     */
    public static Optional<String> getSubject(String token) {
        return decode(token).map(JWTClaimsSet::getSubject);
    }

    /**
     * JWTトークンからメールアドレスを取得
     * 
     * @param token JWTトークン
     * @return メールアドレス（取得に失敗した場合はEmpty）
     */
    public static Optional<String> getEmail(String token) {
        return decode(token).map(claims -> {
            try {
                return claims.getStringClaim("email");
            } catch (ParseException e) {
                log.error("emailクレームの取得に失敗しました: {}", e.getMessage());
                return null;
            }
        });
    }

    /**
     * JWTトークンから名前を取得
     * 
     * @param token JWTトークン
     * @return 名前（取得に失敗した場合はEmpty）
     */
    public static Optional<String> getName(String token) {
        return decode(token).map(claims -> {
            try {
                return claims.getStringClaim("name");
            } catch (ParseException e) {
                log.error("nameクレームの取得に失敗しました: {}", e.getMessage());
                return null;
            }
        });
    }

    /**
     * JWTトークンからissuerを取得
     * 
     * @param token JWTトークン
     * @return issuer（取得に失敗した場合はEmpty）
     */
    public static Optional<String> getIssuer(String token) {
        return decode(token).map(JWTClaimsSet::getIssuer);
    }

    /**
     * JWTトークンが期限切れかどうかを確認
     * 
     * @param token JWTトークン
     * @return 期限切れの場合true、有効な場合false、判定不能な場合もtrue
     */
    public static boolean isExpired(String token) {
        return decode(token)
            .map(claims -> {
                if (claims.getExpirationTime() == null) {
                    return true;
                }
                return claims.getExpirationTime().before(new java.util.Date());
            })
            .orElse(true);
    }
}
