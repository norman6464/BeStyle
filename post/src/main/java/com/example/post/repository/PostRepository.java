package com.example.post.repository;

import com.example.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

    /**
     * 全ての投稿を取得（削除されていないもの）
     */
    Page<Post> findByIsDeletedFalseOrderByCreatedAtDesc(Pageable pageable);

    /**
     * ユーザーIDで投稿を検索（削除されていないもの）
     */
    List<Post> findByUserIdAndIsDeletedFalse(Integer userId);

    /**
     * ユーザーIDで投稿数をカウント（削除されていないもの）
     */
    long countByUserIdAndIsDeletedFalse(Integer userId);

    /**
     * リプライ先IDで投稿を検索
     */
    List<Post> findByReplyToIdAndIsDeletedFalse(Integer replyToId);

    /**
     * リポスト元IDで投稿を検索
     */
    List<Post> findByRepostOfIdAndIsDeletedFalse(Integer repostOfId);

    /**
     * 引用元IDで投稿を検索
     */
    List<Post> findByQuoteOfIdAndIsDeletedFalse(Integer quoteOfId);

    /**
     * 可視性で投稿を検索
     */
    List<Post> findByVisibilityAndIsDeletedFalse(String visibility);
}
