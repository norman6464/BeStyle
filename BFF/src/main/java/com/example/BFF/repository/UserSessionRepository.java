package com.example.BFF.repository;

import com.example.BFF.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * セッション管理リポジトリ
 */
@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Integer> {

    /**
     * セッションIDでセッションを検索
     */
    Optional<UserSession> findBySessionId(String sessionId);

    /**
     * ユーザーIDでセッションを検索
     */
    List<UserSession> findByUserId(Integer userId);

    /**
     * CognitoSubでセッションを検索
     */
    Optional<UserSession> findByCognitoSub(String cognitoSub);

    /**
     * 有効期限切れのセッションを検索
     */
    List<UserSession> findByExpiresAtBefore(LocalDateTime dateTime);

    /**
     * 有効期限切れのセッションを削除
     */
    @Transactional
    @Modifying
    @Query("DELETE FROM UserSession s WHERE s.expiresAt < :dateTime")
    int deleteExpiredSessions(@Param("dateTime") LocalDateTime dateTime);

    /**
     * セッションIDでセッションを削除
     */
    @Transactional
    @Modifying
    void deleteBySessionId(String sessionId);

    /**
     * ユーザーIDでセッションを削除（すべてのセッションをログアウト）
     */
    @Transactional
    @Modifying
    void deleteByUserId(Integer userId);

    /**
     * CognitoSubでセッションを削除
     */
    @Transactional
    @Modifying
    void deleteByCognitoSub(String cognitoSub);

    /**
     * セッションIDが存在するか確認
     */
    boolean existsBySessionId(String sessionId);

    /**
     * 有効なセッションかどうかを確認（有効期限チェック付き）
     */
    @Query("SELECT s FROM UserSession s WHERE s.sessionId = :sessionId AND s.expiresAt > :now")
    Optional<UserSession> findValidSession(
        @Param("sessionId") String sessionId, 
        @Param("now") LocalDateTime now
    );
}
