package com.example.user.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "user_identities",
    uniqueConstraints = @UniqueConstraint(columnNames = {"provider", "provider_id"})
)
public class UserIdentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(nullable = false, length = 20)
    private String provider;

    @Column(nullable = false, length = 255)
    private String providerId;

    public UserIdentity() {
    }

    public UserIdentity(Integer userId, String provider, String providerId) {
        this.userId = userId;
        this.provider = provider;
        this.providerId = providerId;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }
}
