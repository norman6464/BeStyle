package com.example.post.service;

import com.example.post.entity.PostBookmark;
import com.example.post.repository.PostBookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostBookmarkService {

    private final PostBookmarkRepository postBookmarkRepository;

    /**
     * ブックマークを追加
     */
    @Transactional
    public PostBookmark bookmarkPost(Integer postId, Integer userId) {
        Optional<PostBookmark> existingBookmark = postBookmarkRepository.findByPostIdAndUserId(postId, userId);
        if (existingBookmark.isPresent()) {
            throw new IllegalStateException("既にブックマークしています");
        }

        PostBookmark bookmark = new PostBookmark();
        bookmark.setPostId(postId);
        bookmark.setUserId(userId);
        return postBookmarkRepository.save(bookmark);
    }

    /**
     * ブックマークを削除
     */
    @Transactional
    public void unbookmarkPost(Integer postId, Integer userId) {
        PostBookmark bookmark = postBookmarkRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new IllegalArgumentException("ブックマークが見つかりません"));
        postBookmarkRepository.delete(bookmark);
    }

    /**
     * ブックマークを取得
     */
    public Optional<PostBookmark> getBookmark(Integer postId, Integer userId) {
        return postBookmarkRepository.findByPostIdAndUserId(postId, userId);
    }

    /**
     * ブックマークしているか確認
     */
    public boolean isBookmarked(Integer postId, Integer userId) {
        return postBookmarkRepository.existsByPostIdAndUserId(postId, userId);
    }

    /**
     * ユーザーのブックマーク一覧を取得
     */
    public List<PostBookmark> getBookmarksByUserId(Integer userId) {
        return postBookmarkRepository.findByUserId(userId);
    }

    /**
     * 投稿のブックマーク一覧を取得
     */
    public List<PostBookmark> getBookmarksByPostId(Integer postId) {
        return postBookmarkRepository.findByPostId(postId);
    }
}
