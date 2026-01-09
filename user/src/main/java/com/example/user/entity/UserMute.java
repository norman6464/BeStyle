package com.example.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_mutes", uniqueConstraints = @UniqueConstraint(columnNames = {"muter_id", "muted_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserMute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "muter_id", nullable = false)
    private Integer muterId;

    @Column(name = "muted_id", nullable = false)
    private Integer mutedId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
