package com.example.user.repository;

import com.example.user.entity.UserBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBlockRepository extends JpaRepository<UserBlock, Integer> {

    /**
     * ブロッカーIDとブロックされたIDで検索
     */
    Optional<UserBlock> findByBlockerIdAndBlockedId(Integer blockerId, Integer blockedId);

    /**
     * ブロッカーIDで検索（ブロックしているユーザー一覧）
     */
    List<UserBlock> findByBlockerId(Integer blockerId);

    /**
     * ブロックされたIDで検索（ブロックされているユーザー一覧）
     */
    List<UserBlock> findByBlockedId(Integer blockedId);

    /**
     * ブロック関係が存在するか確認
     */
    boolean existsByBlockerIdAndBlockedId(Integer blockerId, Integer blockedId);
}
