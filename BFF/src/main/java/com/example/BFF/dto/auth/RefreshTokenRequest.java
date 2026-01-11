package com.example.BFF.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * トークンリフレッシュリクエストDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshTokenRequest {
    
    /**
     * リフレッシュトークン
     */
    private String refreshToken;
}
