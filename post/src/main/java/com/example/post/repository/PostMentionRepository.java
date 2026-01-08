package com.example.post.repository;

import com.example.post.entity.PostMention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostMentionRepository extends JpaRepository<PostMention, Integer> {

    /**
     * 投稿IDでメンションを検索
     */
    List<PostMention> findByPostId(Integer postId);

    /**
     * メンションされたユーザーIDで検索
     */
    List<PostMention> findByMentionedUserId(Integer mentionedUserId);
}
