package com.example.post.repository;

import com.example.post.entity.PostBookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostBookmarkRepository extends JpaRepository<PostBookmark, Integer> {

    /**
     * 投稿IDとユーザーIDでブックマークを検索
     */
    Optional<PostBookmark> findByPostIdAndUserId(Integer postId, Integer userId);

    /**
     * ユーザーIDでブックマークを検索
     */
    List<PostBookmark> findByUserId(Integer userId);

    /**
     * 投稿IDでブックマークを検索
     */
    List<PostBookmark> findByPostId(Integer postId);

    /**
     * ユーザーが投稿をブックマークしているかチェック
     */
    boolean existsByPostIdAndUserId(Integer postId, Integer userId);
}
