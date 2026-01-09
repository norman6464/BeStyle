package com.example.post.repository;

import com.example.post.entity.PostStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostStatsRepository extends JpaRepository<PostStats, Integer> {
    
    /**
     * 投稿IDで統計情報を検索
     */
    Optional<PostStats> findByPostId(Integer postId);
}
