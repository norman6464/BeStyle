package com.example.BFF.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * セッション設定クラス
 * application.propertiesのsession.*設定を読み込む
 */
@Configuration
@ConfigurationProperties(prefix = "session")
@Getter
@Setter
public class SessionConfig {

    /**
     * Cookie名
     */
    private String cookieName = "BESTYLE_SESSION";

    /**
     * セッション有効期限（時間）
     */
    private int expiryHours = 24;
}
