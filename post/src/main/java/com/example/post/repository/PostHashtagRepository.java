package com.example.post.repository;

import com.example.post.entity.PostHashtag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostHashtagRepository extends JpaRepository<PostHashtag, Integer> {

    /**
     * 投稿IDでハッシュタグを検索
     */
    List<PostHashtag> findByPostId(Integer postId);

    /**
     * ハッシュタグIDで投稿を検索
     */
    List<PostHashtag> findByHashtagId(Integer hashtagId);

    /**
     * 投稿IDとハッシュタグIDで検索
     */
    Optional<PostHashtag> findByPostIdAndHashtagId(Integer postId, Integer hashtagId);

    /**
     * 投稿IDとハッシュタグIDで存在チェック
     */
    boolean existsByPostIdAndHashtagId(Integer postId, Integer hashtagId);
}
