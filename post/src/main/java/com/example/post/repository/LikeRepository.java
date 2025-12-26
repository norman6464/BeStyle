package com.example.post.repository;

import com.example.post.entity.Like;
import com.example.post.entity.LikeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, LikeId> {

    /**
     * 投稿IDでいいねを検索
     */
    List<Like> findByPostId(Integer postId);

    /**
     * ユーザーIDでいいねを検索
     */
    List<Like> findByUserId(Integer userId);

    /**
     * 投稿IDとユーザーIDでいいねを検索
     */
    Optional<Like> findByPostIdAndUserId(Integer postId, Integer userId);

    /**
     * 投稿IDのいいね数をカウント
     */
    long countByPostId(Integer postId);

    /**
     * ユーザーが投稿にいいねしているかチェック
     */
    boolean existsByPostIdAndUserId(Integer postId, Integer userId);
}
