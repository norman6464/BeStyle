package com.example.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Column(length = 10)
    private String language = "ja";

    @Column(length = 50)
    private String timezone = "Asia/Tokyo";

    @Column(name = "email_notification_enabled", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean emailNotificationEnabled = true;

    @Column(name = "push_notification_enabled", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean pushNotificationEnabled = true;

    @Column(name = "dm_permission", length = 20)
    private String dmPermission = "EVERYONE";

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
