package com.example.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "user_identities",
    uniqueConstraints = @UniqueConstraint(columnNames = {"provider", "provider_id"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserIdentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 20)
    private String provider;

    @Column(nullable = false, length = 255)
    private String providerId;
}
