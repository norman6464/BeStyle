package com.example.BFF.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * セッション管理エンティティ
 * httpOnly Cookieに保存するセッションIDと紐づくトークン情報を管理
 */
@Entity
@Table(name = "user_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * セッションID（httpOnly CookieにセットされるUUID）
     */
    @Column(nullable = false, unique = true, length = 128)
    private String sessionId;

    /**
     * userサービスのユーザーID
     */
    @Column(nullable = false)
    private Integer userId;

    /**
     * CognitoのユーザーSub
     */
    @Column(nullable = false, length = 255)
    private String cognitoSub;

    /**
     * Cognitoから取得したアクセストークン
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String accessToken;

    /**
     * Cognitoから取得したリフレッシュトークン
     */
    @Column(columnDefinition = "TEXT")
    private String refreshToken;

    /**
     * Cognitoから取得したIDトークン
     */
    @Column(columnDefinition = "TEXT")
    private String idToken;

    /**
     * セッション有効期限
     */
    @Column(nullable = false)
    private LocalDateTime expiresAt;

    /**
     * セッション作成日時
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * セッション更新日時
     */
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * セッションが有効期限切れかどうかを確認
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
