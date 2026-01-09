package com.example.post.service;

import com.example.post.entity.PostStats;
import com.example.post.repository.PostStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostStatsService {

    private final PostStatsRepository postStatsRepository;

    /**
     * 投稿統計を取得
     */
    public Optional<PostStats> getPostStats(Integer postId) {
        return postStatsRepository.findByPostId(postId);
    }

    /**
     * 投稿統計を更新
     */
    @Transactional
    public PostStats updatePostStats(Integer postId, PostStats statsData) {
        PostStats stats = postStatsRepository.findByPostId(postId)
                .orElseThrow(() -> new IllegalArgumentException("投稿統計が見つかりません"));

        if (statsData.getLikeCount() != null) {
            stats.setLikeCount(statsData.getLikeCount());
        }
        if (statsData.getReplyCount() != null) {
            stats.setReplyCount(statsData.getReplyCount());
        }
        if (statsData.getRepostCount() != null) {
            stats.setRepostCount(statsData.getRepostCount());
        }
        if (statsData.getQuoteCount() != null) {
            stats.setQuoteCount(statsData.getQuoteCount());
        }
        if (statsData.getViewCount() != null) {
            stats.setViewCount(statsData.getViewCount());
        }

        return postStatsRepository.save(stats);
    }

    /**
     * 閲覧数を増加
     */
    @Transactional
    public void incrementViewCount(Integer postId) {
        Optional<PostStats> statsOpt = postStatsRepository.findByPostId(postId);
        if (statsOpt.isPresent()) {
            PostStats stats = statsOpt.get();
            stats.setViewCount(stats.getViewCount() + 1);
            postStatsRepository.save(stats);
        }
    }
}
