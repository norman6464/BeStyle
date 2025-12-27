package com.example.BFF.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer{
  
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") // すべてのパスに対応
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET","POST","PUT","DELETE")
            .allowCredentials(true); // Cookieなどの認証情報も許可する場合
  }
  
}
