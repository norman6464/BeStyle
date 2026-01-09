package com.example.follow.repository;

import com.example.follow.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Integer> {

    /**
     * フォロワーIDとフォロー中IDで検索
     */
    Optional<Follow> findByFollowerIdAndFollowingId(Integer followerId, Integer followingId);

    /**
     * フォロワーIDで検索（フォローしているユーザー一覧）
     */
    List<Follow> findByFollowerIdAndStatus(Integer followerId, String status);

    /**
     * フォロー中IDで検索（フォロワー一覧）
     */
    List<Follow> findByFollowingIdAndStatus(Integer followingId, String status);

    /**
     * フォロー関係が存在するか確認
     */
    boolean existsByFollowerIdAndFollowingIdAndStatus(Integer followerId, Integer followingId, String status);
}
