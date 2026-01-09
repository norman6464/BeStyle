package com.example.user.repository;

import com.example.user.entity.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettings, Integer> {
    
    /**
     * ユーザーIDで設定情報を検索
     */
    Optional<UserSettings> findByUserId(Integer userId);
}
