package com.example.BFF.config;

import com.example.BFF.util.JwtTokenUtil;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

/**
 * Feignクライアントの設定
 * JWTトークンを自動的にリクエストヘッダーに追加
 */
@Configuration
@RequiredArgsConstructor
public class FeignConfig {

    private final JwtTokenUtil jwtTokenUtil;

    /**
     * Feignリクエストインターセプター
     * すべてのFeignリクエストにJWTトークンを追加
     */
    @Bean
    public RequestInterceptor requestInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate template) {
                // 現在のJWTトークンを取得してヘッダーに追加
                Optional<String> token = jwtTokenUtil.getCurrentJwtTokenString();
                token.ifPresent(t -> template.header("Authorization", "Bearer " + t));
            }
        };
    }
}
