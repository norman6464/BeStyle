package com.example.post.repository;

import com.example.post.entity.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HashtagRepository extends JpaRepository<Hashtag, Integer> {

    /**
     * 名前でハッシュタグを検索
     */
    Optional<Hashtag> findByName(String name);

    /**
     * 名前でハッシュタグが存在するかチェック
     */
    boolean existsByName(String name);
}
