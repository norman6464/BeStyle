package com.example.user.controller;

import com.example.user.entity.UserStats;
import com.example.user.service.UserStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users/{userId}/stats")
@RequiredArgsConstructor
public class UserStatsController {

    private final UserStatsService userStatsService;

    /**
     * ユーザー統計を取得
     */
    @GetMapping
    public ResponseEntity<UserStats> getUserStats(@PathVariable Integer userId) {
        Optional<UserStats> stats = userStatsService.getUserStats(userId);
        return stats.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * ユーザー統計を更新
     */
    @PutMapping
    public ResponseEntity<UserStats> updateUserStats(@PathVariable Integer userId, @RequestBody UserStats stats) {
        try {
            UserStats updatedStats = userStatsService.updateUserStats(userId, stats);
            return ResponseEntity.ok(updatedStats);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
