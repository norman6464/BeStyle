package com.example.BFF.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserToken {

    @Id
    @Column(name = "user_id", length = 255)
    private String userId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String accessToken;

    @Column(columnDefinition = "TEXT")
    private String refreshToken;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
    }
}
