package com.example.BFF.config;

import com.example.BFF.filter.SessionAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final SessionAuthenticationFilter sessionAuthenticationFilter;

    /**
     * SecurityFilterChainの設定
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CORS設定
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // CSRF保護を無効化（独自セッション管理のため）
            .csrf(csrf -> csrf.disable())
            
            // セッション管理をSTATELESSに設定（独自セッション管理のため）
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // 認証・認可の設定
            .authorizeHttpRequests(auth -> auth
                // 公開エンドポイント（認証なしでアクセス可能）
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/error").permitAll()
                
                // 認証エンドポイント（認証なしでアクセス可能）
                .requestMatchers("/api/auth/**").permitAll()
                
                // OPTIONSリクエストを許可（CORS preflight対応）
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // その他のエンドポイントは認証が必要
                .anyRequest().authenticated()
            )
            
            // セッションベース認証フィルターを追加
            .addFilterBefore(sessionAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }

    /**
     * CORS設定
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 許可するオリジン
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:3000"
        ));
        
        // 許可するHTTPメソッド
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        // 許可するヘッダー
        configuration.setAllowedHeaders(List.of("*"));
        
        // 認証情報（Cookie等）を許可
        configuration.setAllowCredentials(true);
        
        // プリフライトリクエストのキャッシュ時間
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}

