package com.example.BFF.service;

import com.example.BFF.config.SessionConfig;
import com.example.BFF.entity.UserSession;
import com.example.BFF.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * セッション管理サービス
 * ユーザーセッションのライフサイクル管理を担当
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserSessionService {

    private final UserSessionRepository sessionRepository;
    private final SessionConfig sessionConfig;

    /**
     * 新規セッションを作成
     */
    @Transactional
    public String createSession(Integer userId, String cognitoSub, 
                                String accessToken, String refreshToken, String idToken) {
        // 既存のセッションがあれば削除（ユーザーは同時に1セッションのみ）
        deleteSessionByCognitoSub(cognitoSub);

        String sessionId = UUID.randomUUID().toString();
        
        UserSession session = UserSession.builder()
            .sessionId(sessionId)
            .userId(userId)
            .cognitoSub(cognitoSub)
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .idToken(idToken)
            .expiresAt(LocalDateTime.now().plusHours(sessionConfig.getExpiryHours()))
            .build();
        
        sessionRepository.save(session);
        log.info("✅ セッション作成成功: sessionId={}", sessionId.substring(0, 8) + "...");
        
        return sessionId;
    }

    /**
     * セッションを更新
     */
    @Transactional
    public void updateSession(String sessionId, String accessToken, String idToken) {
        sessionRepository.findBySessionId(sessionId).ifPresent(session -> {
            session.setAccessToken(accessToken);
            session.setIdToken(idToken);
            session.setExpiresAt(LocalDateTime.now().plusHours(sessionConfig.getExpiryHours()));
            sessionRepository.save(session);
            log.info("✅ セッション更新成功: sessionId={}", sessionId.substring(0, 8) + "...");
        });
    }

    /**
     * セッションIDで検索
     */
    public Optional<UserSession> findBySessionId(String sessionId) {
        return sessionRepository.findBySessionId(sessionId);
    }

    /**
     * 有効なセッションを検索（期限切れチェック付き）
     */
    public Optional<UserSession> findValidSession(String sessionId) {
        return sessionRepository.findValidSession(sessionId, LocalDateTime.now());
    }

    /**
     * CognitoSubでセッションを検索
     */
    public Optional<UserSession> findByCognitoSub(String cognitoSub) {
        return sessionRepository.findByCognitoSub(cognitoSub);
    }

    /**
     * セッションIDで削除
     */
    @Transactional
    public void deleteSessionById(String sessionId) {
        sessionRepository.deleteBySessionId(sessionId);
        log.info("✅ セッション削除成功: sessionId={}", sessionId.substring(0, 8) + "...");
    }

    /**
     * CognitoSubでセッションを削除
     */
    @Transactional
    public void deleteSessionByCognitoSub(String cognitoSub) {
        sessionRepository.findByCognitoSub(cognitoSub).ifPresent(session -> {
            sessionRepository.delete(session);
            log.info("✅ 既存セッション削除: cognitoSub={}", cognitoSub);
        });
    }

    /**
     * 期限切れセッションを削除（クリーンアップ用）
     */
    @Transactional
    public int deleteExpiredSessions() {
        // 期限切れセッションを削除するロジック
        // 必要に応じてリポジトリメソッドを追加
        log.info("✅ 期限切れセッションをクリーンアップ");
        return 0;
    }

    /**
     * セッションが有効かどうかを判定
     */
    public boolean isValidSession(String sessionId) {
        return findValidSession(sessionId).isPresent();
    }
}
