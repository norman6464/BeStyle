package com.example.user.service;

import com.example.user.entity.User;
import com.example.user.entity.UserStats;
import com.example.user.entity.UserSettings;
import com.example.user.repository.UserRepository;
import com.example.user.repository.UserStatsRepository;
import com.example.user.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserStatsRepository userStatsRepository;
    private final UserSettingsRepository userSettingsRepository;

    /**
     * ユーザーを作成
     */
    @Transactional
    public User createUser(User user) {
        User savedUser = userRepository.save(user);

        // ユーザー統計を初期化
        UserStats stats = new UserStats();
        stats.setUserId(savedUser.getId());
        stats.setPostCount(0);
        stats.setFollowerCount(0);
        stats.setFollowingCount(0);
        userStatsRepository.save(stats);

        // ユーザー設定を初期化
        UserSettings settings = new UserSettings();
        settings.setUserId(savedUser.getId());
        settings.setLanguage("ja");
        settings.setTimezone("Asia/Tokyo");
        settings.setEmailNotificationEnabled(true);
        settings.setPushNotificationEnabled(true);
        settings.setDmPermission("EVERYONE");
        userSettingsRepository.save(settings);

        return savedUser;
    }

    /**
     * ユーザーを取得
     */
    public Optional<User> getUser(Integer id) {
        return userRepository.findByIdAndStatus(id, "ACTIVE");
    }

    /**
     * ユーザーを取得（Cognitoサブで）
     */
    public Optional<User> getUserByCognitoSub(String cognitoSub) {
        return userRepository.findByCognitoSub(cognitoSub);
    }

    /**
     * ユーザーを取得（ユーザー名で）
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * ユーザーを取得（メールアドレスで）
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * ユーザーを更新
     */
    @Transactional
    public User updateUser(Integer id, User userData) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません"));

        if (userData.getDisplayName() != null) {
            user.setDisplayName(userData.getDisplayName());
        }
        if (userData.getBio() != null) {
            user.setBio(userData.getBio());
        }
        if (userData.getProfileImageUrl() != null) {
            user.setProfileImageUrl(userData.getProfileImageUrl());
        }
        if (userData.getHeaderImageUrl() != null) {
            user.setHeaderImageUrl(userData.getHeaderImageUrl());
        }
        if (userData.getLocation() != null) {
            user.setLocation(userData.getLocation());
        }
        if (userData.getWebsiteUrl() != null) {
            user.setWebsiteUrl(userData.getWebsiteUrl());
        }
        if (userData.getBirthDate() != null) {
            user.setBirthDate(userData.getBirthDate());
        }
        if (userData.getIsPrivate() != null) {
            user.setIsPrivate(userData.getIsPrivate());
        }

        return userRepository.save(user);
    }

    /**
     * ユーザーを削除（論理削除）
     */
    @Transactional
    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません"));
        user.setStatus("DELETED");
        userRepository.save(user);
    }

    /**
     * ユーザー名が利用可能か確認
     */
    public boolean isUsernameAvailable(String username) {
        return !userRepository.findByUsername(username).isPresent();
    }

    /**
     * メールアドレスが利用可能か確認
     */
    public boolean isEmailAvailable(String email) {
        return !userRepository.findByEmail(email).isPresent();
    }
}
