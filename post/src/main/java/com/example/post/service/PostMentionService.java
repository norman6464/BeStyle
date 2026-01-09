package com.example.post.service;

import com.example.post.entity.PostMention;
import com.example.post.repository.PostMentionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostMentionService {

    private final PostMentionRepository postMentionRepository;

    /**
     * メンションを作成
     */
    @Transactional
    public PostMention createMention(Integer postId, Integer mentionedUserId) {
        // 既存のメンションを確認（ユニーク制約があるため、既にあればそのまま返す）
        List<PostMention> existingMentions = postMentionRepository.findByPostId(postId);
        boolean alreadyMentioned = existingMentions.stream()
                .anyMatch(m -> m.getMentionedUserId().equals(mentionedUserId));
        
        if (alreadyMentioned) {
            throw new IllegalStateException("既にメンションされています");
        }

        PostMention mention = new PostMention();
        mention.setPostId(postId);
        mention.setMentionedUserId(mentionedUserId);
        return postMentionRepository.save(mention);
    }

    /**
     * メンションを削除
     */
    @Transactional
    public void deleteMention(Integer id) {
        postMentionRepository.deleteById(id);
    }

    /**
     * 投稿のメンション一覧を取得
     */
    public List<PostMention> getMentionsByPostId(Integer postId) {
        return postMentionRepository.findByPostId(postId);
    }

    /**
     * メンションされたユーザーのメンション一覧を取得
     */
    public List<PostMention> getMentionsByUserId(Integer mentionedUserId) {
        return postMentionRepository.findByMentionedUserId(mentionedUserId);
    }
}
