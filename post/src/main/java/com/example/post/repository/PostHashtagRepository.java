package com.example.post.repository;

import com.example.post.entity.PostHashtag;
import com.example.post.entity.PostHashtagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostHashtagRepository extends JpaRepository<PostHashtag, PostHashtagId> {

    /**
     * 投稿IDでハッシュタグを検索
     */
    List<PostHashtag> findByPostId(Integer postId);

    /**
     * ハッシュタグIDで投稿を検索
     */
    List<PostHashtag> findByHashtagId(Integer hashtagId);
}
