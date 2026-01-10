package com.example.BFF.scheduler;

import com.example.BFF.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * セッションクリーンアップスケジューラー
 * 期限切れセッションを定期的に削除
 */
@Component
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class SessionCleanupScheduler {

    private final AuthService authService;

    /**
     * 1時間ごとに期限切れセッションを削除
     */
    @Scheduled(fixedRate = 3600000) // 1時間 = 3600000ms
    public void cleanupExpiredSessions() {
        int deletedCount = authService.cleanupExpiredSessions();
        if (deletedCount > 0) {
            log.info("期限切れセッションを削除しました: {} 件", deletedCount);
        }
    }
}
