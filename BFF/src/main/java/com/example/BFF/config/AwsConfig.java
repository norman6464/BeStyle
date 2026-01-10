package com.example.BFF.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * AWS認証設定クラス
 * application.propertiesのaws.*設定を読み込む
 */
@Configuration
@ConfigurationProperties(prefix = "aws")
@Getter
@Setter
public class AwsConfig {

    /**
     * AWSアクセスキー
     */
    private String accessKey;

    /**
     * AWSシークレットキー
     */
    private String secretKey;

    /**
     * AWSリージョン
     */
    private String region;
}
