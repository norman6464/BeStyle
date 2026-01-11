package com.example.BFF.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Cognito設定クラス
 * application.propertiesのcognito.*設定を読み込む
 */
@Configuration
@ConfigurationProperties(prefix = "cognito")
@Data
public class CognitoConfig {

    /**
     * Cognito User Pool ID
     * 例: ap-northeast-1_TkRen4lyD
     */
    private String userPoolId;

    /**
     * Cognito App Client ID
     */
    private String clientId;

    /**
     * Cognito App Client Secret
     */
    private String clientSecret;

    /**
     * Cognito Domain
     * 例: ap-northeast-1tkren4lyd.auth.ap-northeast-1.amazoncognito.com
     */
    private String domain;

    /**
     * リダイレクトURI（フロントエンドのコールバック先）
     * 例: http://localhost:5173/login/callback
     */
    private String redirectUri;

    /**
     * トークンエンドポイント
     * 例: https://ap-northeast-1tkren4lyd.auth.ap-northeast-1.amazoncognito.com/oauth2/token
     */
    private String tokenUri;

    /**
     * JWKセットURI（公開鍵）
     * 例: https://cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_TkRen4lyD/.well-known/jwks.json
     */
    private String jwkSetUri;

    /**
     * 認可エンドポイントのベースURLを取得
     */
    public String getAuthorizationEndpoint() {
        return "https://" + domain + "/oauth2/authorize";
    }

    /**
     * ログアウトエンドポイントを取得
     */
    public String getLogoutEndpoint() {
        return "https://" + domain + "/logout";
    }

    /**
     * サインアップエンドポイントを取得（Hosted UI）
     */
    public String getSignupEndpoint() {
        return "https://" + domain + "/signup";
    }
}
