package com.example.follow.repository;

import com.example.follow.entity.FollowRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRequestRepository extends JpaRepository<FollowRequest, Integer> {

    /**
     * リクエスターIDとターゲットIDで検索
     */
    Optional<FollowRequest> findByRequesterIdAndTargetId(Integer requesterId, Integer targetId);

    /**
     * ターゲットIDとステータスで検索（受信したリクエスト一覧）
     */
    List<FollowRequest> findByTargetIdAndStatus(Integer targetId, String status);

    /**
     * リクエスターIDとステータスで検索（送信したリクエスト一覧）
     */
    List<FollowRequest> findByRequesterIdAndStatus(Integer requesterId, String status);

    /**
     * リクエストが存在するか確認
     */
    boolean existsByRequesterIdAndTargetIdAndStatus(Integer requesterId, Integer targetId, String status);
}
