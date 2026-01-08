package com.example.user.repository;

import com.example.user.entity.UserMute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserMuteRepository extends JpaRepository<UserMute, Integer> {

    /**
     * ミュートするIDとミュートされるIDで検索
     */
    Optional<UserMute> findByMuterIdAndMutedId(Integer muterId, Integer mutedId);

    /**
     * ミュートするIDで検索（ミュートしているユーザー一覧）
     */
    List<UserMute> findByMuterId(Integer muterId);

    /**
     * ミュート関係が存在するか確認
     */
    boolean existsByMuterIdAndMutedId(Integer muterId, Integer mutedId);
}
