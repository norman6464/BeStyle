package com.example.BFF.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * ユーザー情報のDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Integer id;
    private String cognitoSub;
    private String username;
    private String email;
    private String displayName;
    private String bio;
    private String profileImageUrl;
    private String headerImageUrl;
    private String location;
    private String websiteUrl;
    private LocalDate birthDate;
    private Boolean isPrivate;
    private Boolean isVerified;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
