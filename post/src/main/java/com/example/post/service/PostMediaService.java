package com.example.post.service;

import com.example.post.entity.PostMedia;
import com.example.post.repository.PostMediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostMediaService {

    private final PostMediaRepository postMediaRepository;

    /**
     * メディアを作成
     */
    @Transactional
    public PostMedia createPostMedia(PostMedia postMedia) {
        return postMediaRepository.save(postMedia);
    }

    /**
     * メディアを取得
     */
    public Optional<PostMedia> getPostMedia(Integer id) {
        return postMediaRepository.findById(id);
    }

    /**
     * メディアを更新
     */
    @Transactional
    public PostMedia updatePostMedia(Integer id, PostMedia mediaData) {
        PostMedia media = postMediaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("メディアが見つかりません"));

        if (mediaData.getUrl() != null) {
            media.setUrl(mediaData.getUrl());
        }
        if (mediaData.getThumbnailUrl() != null) {
            media.setThumbnailUrl(mediaData.getThumbnailUrl());
        }
        if (mediaData.getAltText() != null) {
            media.setAltText(mediaData.getAltText());
        }
        if (mediaData.getDisplayOrder() != null) {
            media.setDisplayOrder(mediaData.getDisplayOrder());
        }

        return postMediaRepository.save(media);
    }

    /**
     * メディアを削除
     */
    @Transactional
    public void deletePostMedia(Integer id) {
        postMediaRepository.deleteById(id);
    }

    /**
     * 投稿のメディア一覧を取得
     */
    public List<PostMedia> getMediaByPostId(Integer postId) {
        return postMediaRepository.findByPostIdOrderByDisplayOrderAsc(postId);
    }

    /**
     * メディアタイプで検索
     */
    public List<PostMedia> getMediaByType(String mediaType) {
        return postMediaRepository.findByMediaType(mediaType);
    }
}
