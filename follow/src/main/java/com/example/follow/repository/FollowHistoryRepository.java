package com.example.follow.repository;

import com.example.follow.entity.FollowHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowHistoryRepository extends JpaRepository<FollowHistory, Integer> {

    /**
     * フォロワーIDで検索
     */
    List<FollowHistory> findByFollowerId(Integer followerId);

    /**
     * フォロー中IDで検索
     */
    List<FollowHistory> findByFollowingId(Integer followingId);

    /**
     * アクションで検索
     */
    List<FollowHistory> findByAction(String action);
}
