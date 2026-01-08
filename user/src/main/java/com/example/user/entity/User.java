package com.example.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "cognito_sub", nullable = false, unique = true, length = 255)
    private String cognitoSub;

    @Column(nullable = false, unique = true, length = 30)
    private String username;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "display_name", nullable = false, length = 50)
    private String displayName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Column(name = "header_image_url", length = 500)
    private String headerImageUrl;

    @Column(length = 100)
    private String location;

    @Column(name = "website_url", length = 200)
    private String websiteUrl;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "is_private", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isPrivate = false;

    @Column(name = "is_verified", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isVerified = false;

    @Column(length = 20)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
