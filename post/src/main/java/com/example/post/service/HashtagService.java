package com.example.post.service;

import com.example.post.entity.Hashtag;
import com.example.post.repository.HashtagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HashtagService {

    private final HashtagRepository hashtagRepository;

    /**
     * ハッシュタグを作成または取得
     */
    @Transactional
    public Hashtag getOrCreateHashtag(String name) {
        return hashtagRepository.findByName(name)
                .orElseGet(() -> {
                    Hashtag hashtag = new Hashtag();
                    hashtag.setName(name);
                    hashtag.setPostCount(0);
                    return hashtagRepository.save(hashtag);
                });
    }

    /**
     * ハッシュタグを取得
     */
    public Optional<Hashtag> getHashtag(String name) {
        return hashtagRepository.findByName(name);
    }

    /**
     * ハッシュタグを取得（IDで）
     */
    public Optional<Hashtag> getHashtagById(Integer id) {
        return hashtagRepository.findById(id);
    }

    /**
     * ハッシュタグの投稿数を増加
     */
    @Transactional
    public void incrementPostCount(Integer hashtagId) {
        Hashtag hashtag = hashtagRepository.findById(hashtagId)
                .orElseThrow(() -> new IllegalArgumentException("ハッシュタグが見つかりません"));
        hashtag.setPostCount(hashtag.getPostCount() + 1);
        hashtagRepository.save(hashtag);
    }

    /**
     * ハッシュタグの投稿数を減少
     */
    @Transactional
    public void decrementPostCount(Integer hashtagId) {
        Hashtag hashtag = hashtagRepository.findById(hashtagId)
                .orElseThrow(() -> new IllegalArgumentException("ハッシュタグが見つかりません"));
        if (hashtag.getPostCount() > 0) {
            hashtag.setPostCount(hashtag.getPostCount() - 1);
            hashtagRepository.save(hashtag);
        }
    }
}
