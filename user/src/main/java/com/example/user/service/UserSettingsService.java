package com.example.user.service;

import com.example.user.entity.UserSettings;
import com.example.user.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;

    /**
     * ユーザー設定を取得
     */
    public Optional<UserSettings> getUserSettings(Integer userId) {
        return userSettingsRepository.findById(userId);
    }

    /**
     * ユーザー設定を更新
     */
    @Transactional
    public UserSettings updateUserSettings(Integer userId, UserSettings settingsData) {
        UserSettings settings = userSettingsRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("ユーザー設定が見つかりません"));

        if (settingsData.getLanguage() != null) {
            settings.setLanguage(settingsData.getLanguage());
        }
        if (settingsData.getTimezone() != null) {
            settings.setTimezone(settingsData.getTimezone());
        }
        if (settingsData.getEmailNotificationEnabled() != null) {
            settings.setEmailNotificationEnabled(settingsData.getEmailNotificationEnabled());
        }
        if (settingsData.getPushNotificationEnabled() != null) {
            settings.setPushNotificationEnabled(settingsData.getPushNotificationEnabled());
        }
        if (settingsData.getDmPermission() != null) {
            settings.setDmPermission(settingsData.getDmPermission());
        }

        return userSettingsRepository.save(settings);
    }

    /**
     * 言語を更新
     */
    @Transactional
    public UserSettings updateLanguage(Integer userId, String language) {
        UserSettings settings = userSettingsRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("ユーザー設定が見つかりません"));
        settings.setLanguage(language);
        return userSettingsRepository.save(settings);
    }

    /**
     * タイムゾーンを更新
     */
    @Transactional
    public UserSettings updateTimezone(Integer userId, String timezone) {
        UserSettings settings = userSettingsRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("ユーザー設定が見つかりません"));
        settings.setTimezone(timezone);
        return userSettingsRepository.save(settings);
    }

    /**
     * メール通知設定を更新
     */
    @Transactional
    public UserSettings updateEmailNotificationEnabled(Integer userId, Boolean enabled) {
        UserSettings settings = userSettingsRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("ユーザー設定が見つかりません"));
        settings.setEmailNotificationEnabled(enabled);
        return userSettingsRepository.save(settings);
    }

    /**
     * プッシュ通知設定を更新
     */
    @Transactional
    public UserSettings updatePushNotificationEnabled(Integer userId, Boolean enabled) {
        UserSettings settings = userSettingsRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("ユーザー設定が見つかりません"));
        settings.setPushNotificationEnabled(enabled);
        return userSettingsRepository.save(settings);
    }
}
