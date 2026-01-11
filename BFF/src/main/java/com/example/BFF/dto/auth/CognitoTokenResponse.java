package com.example.BFF.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Cognitoトークンレスポンス
 * /oauth2/tokenエンドポイントからのレスポンス
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CognitoTokenResponse {
    
    @JsonProperty("access_token")
    private String accessToken;
    
    @JsonProperty("id_token")
    private String idToken;
    
    @JsonProperty("refresh_token")
    private String refreshToken;
    
    @JsonProperty("token_type")
    private String tokenType;
    
    @JsonProperty("expires_in")
    private Integer expiresIn;
}
