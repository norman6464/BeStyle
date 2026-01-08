package com.example.user.service;

import com.example.user.entity.UserMute;
import com.example.user.repository.UserMuteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserMuteService {

    private final UserMuteRepository userMuteRepository;

    /**
     * ユーザーをミュート
     */
    @Transactional
    public UserMute muteUser(Integer muterId, Integer mutedId) {
        if (muterId.equals(mutedId)) {
            throw new IllegalArgumentException("自分自身をミュートすることはできません");
        }

        Optional<UserMute> existingMute = userMuteRepository.findByMuterIdAndMutedId(muterId, mutedId);
        if (existingMute.isPresent()) {
            throw new IllegalStateException("既にミュートしています");
        }

        UserMute mute = new UserMute();
        mute.setMuterId(muterId);
        mute.setMutedId(mutedId);
        return userMuteRepository.save(mute);
    }

    /**
     * ミュートを解除
     */
    @Transactional
    public void unmuteUser(Integer muterId, Integer mutedId) {
        UserMute mute = userMuteRepository.findByMuterIdAndMutedId(muterId, mutedId)
                .orElseThrow(() -> new IllegalArgumentException("ミュート関係が見つかりません"));
        userMuteRepository.delete(mute);
    }

    /**
     * ミュート関係を取得
     */
    public Optional<UserMute> getMute(Integer muterId, Integer mutedId) {
        return userMuteRepository.findByMuterIdAndMutedId(muterId, mutedId);
    }

    /**
     * ミュートしているか確認
     */
    public boolean isMuted(Integer muterId, Integer mutedId) {
        return userMuteRepository.existsByMuterIdAndMutedId(muterId, mutedId);
    }

    /**
     * ミュートしているユーザー一覧を取得
     */
    public List<UserMute> getMutedUsers(Integer muterId) {
        return userMuteRepository.findByMuterId(muterId);
    }
}
