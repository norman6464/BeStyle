package com.example.BFF.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * WebClient設定
 * HTTP通信用のWebClientを構成
 */
@Configuration
public class WebClientConfig {

    /**
     * WebClient.Builder Bean
     * Cognitoトークンエンドポイントへの通信などに使用
     */
    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    /**
     * ObjectMapper Bean
     * JSON のシリアライズ/デシリアライズに使用
     */
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
