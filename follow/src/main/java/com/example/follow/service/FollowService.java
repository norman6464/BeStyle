package com.example.follow.service;

import com.example.follow.entity.Follow;
import com.example.follow.entity.FollowHistory;
import com.example.follow.repository.FollowHistoryRepository;
import com.example.follow.repository.FollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final FollowHistoryRepository followHistoryRepository;

    /**
     * フォロー関係を作成
     */
    @Transactional
    public Follow follow(Integer followerId, Integer followingId) {
        // 既存のフォロー関係を確認
        Optional<Follow> existingFollow = followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
        if (existingFollow.isPresent()) {
            Follow follow = existingFollow.get();
            if ("ACTIVE".equals(follow.getStatus())) {
                throw new IllegalStateException("既にフォローしています");
            }
            // 再フォローの場合
            follow.setStatus("ACTIVE");
            return followRepository.save(follow);
        }

        Follow follow = new Follow();
        follow.setFollowerId(followerId);
        follow.setFollowingId(followingId);
        follow.setStatus("ACTIVE");

        Follow savedFollow = followRepository.save(follow);

        // 履歴を記録
        FollowHistory history = new FollowHistory();
        history.setFollowerId(followerId);
        history.setFollowingId(followingId);
        history.setAction("FOLLOW");
        followHistoryRepository.save(history);

        return savedFollow;
    }

    /**
     * フォローを解除
     */
    @Transactional
    public void unfollow(Integer followerId, Integer followingId) {
        Optional<Follow> followOpt = followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
        if (followOpt.isPresent()) {
            Follow follow = followOpt.get();
            follow.setStatus("INACTIVE");
            followRepository.save(follow);

            // 履歴を記録
            FollowHistory history = new FollowHistory();
            history.setFollowerId(followerId);
            history.setFollowingId(followingId);
            history.setAction("UNFOLLOW");
            followHistoryRepository.save(history);
        } else {
            throw new IllegalArgumentException("フォロー関係が見つかりません");
        }
    }

    /**
     * フォロー関係を取得
     */
    public Optional<Follow> getFollow(Integer followerId, Integer followingId) {
        return followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
    }

    /**
     * フォローしているか確認
     */
    public boolean isFollowing(Integer followerId, Integer followingId) {
        return followRepository.existsByFollowerIdAndFollowingIdAndStatus(followerId, followingId, "ACTIVE");
    }

    /**
     * フォロワー一覧を取得
     */
    public List<Follow> getFollowers(Integer userId) {
        return followRepository.findByFollowingIdAndStatus(userId, "ACTIVE");
    }

    /**
     * フォロー中一覧を取得
     */
    public List<Follow> getFollowing(Integer userId) {
        return followRepository.findByFollowerIdAndStatus(userId, "ACTIVE");
    }

    /**
     * フォロワー数を取得
     */
    public long getFollowerCount(Integer userId) {
        return followRepository.findByFollowingIdAndStatus(userId, "ACTIVE").size();
    }

    /**
     * フォロー中数を取得
     */
    public long getFollowingCount(Integer userId) {
        return followRepository.findByFollowerIdAndStatus(userId, "ACTIVE").size();
    }
}
