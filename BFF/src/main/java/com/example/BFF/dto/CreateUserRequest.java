package com.example.BFF.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ユーザー作成リクエスト
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    private String cognitoSub;
    private String username;
    private String email;
    private String displayName;
    private String bio;
}
