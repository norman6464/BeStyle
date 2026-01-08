package com.example.post.repository;

import com.example.post.entity.PostMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostMediaRepository extends JpaRepository<PostMedia, Integer> {

    /**
     * 投稿IDでメディアを検索
     */
    List<PostMedia> findByPostIdOrderByDisplayOrderAsc(Integer postId);

    /**
     * メディアタイプで検索
     */
    List<PostMedia> findByMediaType(String mediaType);
}
