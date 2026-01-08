package com.example.post.service;

import com.example.post.entity.Post;
import com.example.post.entity.PostStats;
import com.example.post.repository.PostRepository;
import com.example.post.repository.PostStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostStatsRepository postStatsRepository;

    /**
     * 投稿を作成
     */
    @Transactional
    public Post createPost(Post post) {
        Post savedPost = postRepository.save(post);
        
        // 投稿統計を初期化
        PostStats stats = new PostStats();
        stats.setPostId(savedPost.getId());
        stats.setLikeCount(0);
        stats.setReplyCount(0);
        stats.setRepostCount(0);
        stats.setQuoteCount(0);
        stats.setViewCount(0);
        postStatsRepository.save(stats);

        return savedPost;
    }

    /**
     * 投稿を取得
     */
    public Optional<Post> getPost(Integer id) {
        return postRepository.findById(id)
                .filter(post -> !post.getIsDeleted());
    }

    /**
     * 投稿を更新
     */
    @Transactional
    public Post updatePost(Integer id, Post postData) {
        Post post = postRepository.findById(id)
                .filter(p -> !p.getIsDeleted())
                .orElseThrow(() -> new IllegalArgumentException("投稿が見つかりません"));

        if (postData.getContent() != null) {
            post.setContent(postData.getContent());
        }
        if (postData.getVisibility() != null) {
            post.setVisibility(postData.getVisibility());
        }

        return postRepository.save(post);
    }

    /**
     * 投稿を削除（論理削除）
     */
    @Transactional
    public void deletePost(Integer id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("投稿が見つかりません"));
        post.setIsDeleted(true);
        postRepository.save(post);
    }

    /**
     * ユーザーの投稿一覧を取得
     */
    public List<Post> getPostsByUserId(Integer userId) {
        return postRepository.findByUserIdAndIsDeletedFalse(userId);
    }

    /**
     * リプライ先の投稿一覧を取得
     */
    public List<Post> getReplies(Integer replyToId) {
        return postRepository.findByReplyToIdAndIsDeletedFalse(replyToId);
    }

    /**
     * リポスト元の投稿一覧を取得
     */
    public List<Post> getReposts(Integer repostOfId) {
        return postRepository.findByRepostOfIdAndIsDeletedFalse(repostOfId);
    }

    /**
     * 引用元の投稿一覧を取得
     */
    public List<Post> getQuotes(Integer quoteOfId) {
        return postRepository.findByQuoteOfIdAndIsDeletedFalse(quoteOfId);
    }
}
