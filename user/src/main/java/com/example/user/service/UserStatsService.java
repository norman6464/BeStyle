package com.example.user.service;

import com.example.user.entity.UserStats;
import com.example.user.repository.UserStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserStatsService {

    private final UserStatsRepository userStatsRepository;

    /**
     * ユーザー統計を取得
     */
    public Optional<UserStats> getUserStats(Integer userId) {
        return userStatsRepository.findById(userId);
    }

    /**
     * ユーザー統計を更新
     */
    @Transactional
    public UserStats updateUserStats(Integer userId, UserStats statsData) {
        UserStats stats = userStatsRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("ユーザー統計が見つかりません"));

        if (statsData.getPostCount() != null) {
            stats.setPostCount(statsData.getPostCount());
        }
        if (statsData.getFollowerCount() != null) {
            stats.setFollowerCount(statsData.getFollowerCount());
        }
        if (statsData.getFollowingCount() != null) {
            stats.setFollowingCount(statsData.getFollowingCount());
        }

        return userStatsRepository.save(stats);
    }

    /**
     * 投稿数を増加
     */
    @Transactional
    public void incrementPostCount(Integer userId) {
        Optional<UserStats> statsOpt = userStatsRepository.findById(userId);
        if (statsOpt.isPresent()) {
            UserStats stats = statsOpt.get();
            stats.setPostCount(stats.getPostCount() + 1);
            userStatsRepository.save(stats);
        }
    }

    /**
     * 投稿数を減少
     */
    @Transactional
    public void decrementPostCount(Integer userId) {
        Optional<UserStats> statsOpt = userStatsRepository.findById(userId);
        if (statsOpt.isPresent()) {
            UserStats stats = statsOpt.get();
            if (stats.getPostCount() > 0) {
                stats.setPostCount(stats.getPostCount() - 1);
                userStatsRepository.save(stats);
            }
        }
    }

    /**
     * フォロワー数を増加
     */
    @Transactional
    public void incrementFollowerCount(Integer userId) {
        Optional<UserStats> statsOpt = userStatsRepository.findById(userId);
        if (statsOpt.isPresent()) {
            UserStats stats = statsOpt.get();
            stats.setFollowerCount(stats.getFollowerCount() + 1);
            userStatsRepository.save(stats);
        }
    }

    /**
     * フォロワー数を減少
     */
    @Transactional
    public void decrementFollowerCount(Integer userId) {
        Optional<UserStats> statsOpt = userStatsRepository.findById(userId);
        if (statsOpt.isPresent()) {
            UserStats stats = statsOpt.get();
            if (stats.getFollowerCount() > 0) {
                stats.setFollowerCount(stats.getFollowerCount() - 1);
                userStatsRepository.save(stats);
            }
        }
    }

    /**
     * フォロー中数を増加
     */
    @Transactional
    public void incrementFollowingCount(Integer userId) {
        Optional<UserStats> statsOpt = userStatsRepository.findById(userId);
        if (statsOpt.isPresent()) {
            UserStats stats = statsOpt.get();
            stats.setFollowingCount(stats.getFollowingCount() + 1);
            userStatsRepository.save(stats);
        }
    }

    /**
     * フォロー中数を減少
     */
    @Transactional
    public void decrementFollowingCount(Integer userId) {
        Optional<UserStats> statsOpt = userStatsRepository.findById(userId);
        if (statsOpt.isPresent()) {
            UserStats stats = statsOpt.get();
            if (stats.getFollowingCount() > 0) {
                stats.setFollowingCount(stats.getFollowingCount() - 1);
                userStatsRepository.save(stats);
            }
        }
    }
}
