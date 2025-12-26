package com.example.post.repository;

import com.example.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

    /**
     * ユーザーIDで投稿を検索
     */
    List<Post> findByUserId(Integer userId);

    /**
     * ユーザーIDで投稿数をカウント
     */
    long countByUserId(Integer userId);

    /**
     * タイトルで投稿を検索（部分一致）
     */
    List<Post> findByTitleContaining(String title);
}
