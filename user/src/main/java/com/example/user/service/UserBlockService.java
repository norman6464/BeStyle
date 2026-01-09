package com.example.user.service;

import com.example.user.entity.UserBlock;
import com.example.user.repository.UserBlockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserBlockService {

    private final UserBlockRepository userBlockRepository;

    /**
     * ユーザーをブロック
     */
    @Transactional
    public UserBlock blockUser(Integer blockerId, Integer blockedId) {
        if (blockerId.equals(blockedId)) {
            throw new IllegalArgumentException("自分自身をブロックすることはできません");
        }

        Optional<UserBlock> existingBlock = userBlockRepository.findByBlockerIdAndBlockedId(blockerId, blockedId);
        if (existingBlock.isPresent()) {
            throw new IllegalStateException("既にブロックしています");
        }

        UserBlock block = new UserBlock();
        block.setBlockerId(blockerId);
        block.setBlockedId(blockedId);
        return userBlockRepository.save(block);
    }

    /**
     * ブロックを解除
     */
    @Transactional
    public void unblockUser(Integer blockerId, Integer blockedId) {
        UserBlock block = userBlockRepository.findByBlockerIdAndBlockedId(blockerId, blockedId)
                .orElseThrow(() -> new IllegalArgumentException("ブロック関係が見つかりません"));
        userBlockRepository.delete(block);
    }

    /**
     * ブロック関係を取得
     */
    public Optional<UserBlock> getBlock(Integer blockerId, Integer blockedId) {
        return userBlockRepository.findByBlockerIdAndBlockedId(blockerId, blockedId);
    }

    /**
     * ブロックしているか確認
     */
    public boolean isBlocked(Integer blockerId, Integer blockedId) {
        return userBlockRepository.existsByBlockerIdAndBlockedId(blockerId, blockedId);
    }

    /**
     * ブロックしているユーザー一覧を取得
     */
    public List<UserBlock> getBlockedUsers(Integer blockerId) {
        return userBlockRepository.findByBlockerId(blockerId);
    }

    /**
     * ブロックされているユーザー一覧を取得
     */
    public List<UserBlock> getBlockers(Integer blockedId) {
        return userBlockRepository.findByBlockedId(blockedId);
    }
}
