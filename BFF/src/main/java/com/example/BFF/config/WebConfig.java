package com.example.BFF.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{

    // 許可するオリジンを一元管理
  private static final List<String> ALLOWED_ORIGINS = Arrays.asList(
      "http://localhost:5173",
      "https://normanworld.com"
  );
  
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") // すべてのパスに対応
            .allowedOrigins(ALLOWED_ORIGINS.toArray(new String[0]))
            .allowedMethods("GET","POST","PUT","DELETE")
            .allowCredentials(true); // Cookieなどの認証情報も許可する場合
  }
  
}
