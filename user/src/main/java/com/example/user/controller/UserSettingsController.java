package com.example.user.controller;

import com.example.user.entity.UserSettings;
import com.example.user.service.UserSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users/{userId}/settings")
@RequiredArgsConstructor
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    /**
     * ユーザー設定を取得
     */
    @GetMapping
    public ResponseEntity<UserSettings> getUserSettings(@PathVariable Integer userId) {
        Optional<UserSettings> settings = userSettingsService.getUserSettings(userId);
        return settings.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * ユーザー設定を更新
     */
    @PutMapping
    public ResponseEntity<UserSettings> updateUserSettings(@PathVariable Integer userId, @RequestBody UserSettings settings) {
        try {
            UserSettings updatedSettings = userSettingsService.updateUserSettings(userId, settings);
            return ResponseEntity.ok(updatedSettings);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
