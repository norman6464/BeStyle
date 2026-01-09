package com.example.user.repository;

import com.example.user.entity.UserStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, Integer> {
    
    /**
     * ユーザーIDで統計情報を検索
     */
    Optional<UserStats> findByUserId(Integer userId);
}
