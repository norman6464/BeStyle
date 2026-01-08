package com.example.post.service;

import com.example.post.entity.Like;
import com.example.post.entity.PostStats;
import com.example.post.repository.LikeRepository;
import com.example.post.repository.PostStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostStatsRepository postStatsRepository;

    /**
     * いいねを追加
     */
    @Transactional
    public Like likePost(Integer postId, Integer userId) {
        // 既にいいねしているか確認
        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, userId);
        if (existingLike.isPresent()) {
            throw new IllegalStateException("既にいいねしています");
        }

        Like like = new Like();
        like.setPostId(postId);
        like.setUserId(userId);
        Like savedLike = likeRepository.save(like);

        // 投稿統計を更新
        updateLikeCount(postId, 1);

        return savedLike;
    }

    /**
     * いいねを削除
     */
    @Transactional
    public void unlikePost(Integer postId, Integer userId) {
        Like like = likeRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new IllegalArgumentException("いいねが見つかりません"));
        likeRepository.delete(like);

        // 投稿統計を更新
        updateLikeCount(postId, -1);
    }

    /**
     * いいねを取得
     */
    public Optional<Like> getLike(Integer postId, Integer userId) {
        return likeRepository.findByPostIdAndUserId(postId, userId);
    }

    /**
     * いいねしているか確認
     */
    public boolean isLiked(Integer postId, Integer userId) {
        return likeRepository.existsByPostIdAndUserId(postId, userId);
    }

    /**
     * 投稿のいいね一覧を取得
     */
    public List<Like> getLikesByPostId(Integer postId) {
        return likeRepository.findByPostId(postId);
    }

    /**
     * ユーザーのいいね一覧を取得
     */
    public List<Like> getLikesByUserId(Integer userId) {
        return likeRepository.findByUserId(userId);
    }

    /**
     * いいね数を取得
     */
    public long getLikeCount(Integer postId) {
        return likeRepository.countByPostId(postId);
    }

    /**
     * 投稿統計のいいね数を更新
     */
    private void updateLikeCount(Integer postId, int delta) {
        Optional<PostStats> statsOpt = postStatsRepository.findByPostId(postId);
        if (statsOpt.isPresent()) {
            PostStats stats = statsOpt.get();
            stats.setLikeCount(stats.getLikeCount() + delta);
            postStatsRepository.save(stats);
        }
    }
}
