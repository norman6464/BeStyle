package com.example.BFF.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * SecurityFilterChainの設定
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CSRF保護を無効化（JWT使用のため）
            .csrf(csrf -> csrf.disable())
            
            // セッション管理をSTATELESSに設定（JWT使用のため）
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // 認証・認可の設定
            .authorizeHttpRequests(auth -> auth
                // 公開エンドポイント
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/error").permitAll()
                
                // 認証が必要なエンドポイント
                .anyRequest().authenticated()
            )
            
            // OAuth2 Resource Serverの設定（JWTトークン検証）
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            );
            
        return http.build();
    }

    /**
     * JWT認証コンバーターの設定
     * CognitoのクレームをSpring Securityの権限に変換
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        
        // Cognitoのcognito:groupsクレームから権限を取得
        authoritiesConverter.setAuthoritiesClaimName("cognito:groups");
        authoritiesConverter.setAuthorityPrefix("ROLE_");
        
        JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
        authenticationConverter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);
        
        // プリンシパル名としてusernameを使用
        authenticationConverter.setPrincipalClaimName("cognito:username");
        
        return authenticationConverter;
    }
}
