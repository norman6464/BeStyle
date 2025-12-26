package com.example.chat.repository;

import com.example.chat.entity.RoomMember;
import com.example.chat.entity.RoomMemberId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomMemberRepository extends JpaRepository<RoomMember, RoomMemberId> {

    /**
     * ルームIDでメンバーを検索
     */
    List<RoomMember> findByRoomId(Integer roomId);

    /**
     * ユーザーIDで参加しているルームを検索
     */
    List<RoomMember> findByUserId(Integer userId);

    /**
     * ルームIDとユーザーIDで検索
     */
    Optional<RoomMember> findByRoomIdAndUserId(Integer roomId, Integer userId);

    /**
     * ルームのメンバー数をカウント
     */
    long countByRoomId(Integer roomId);

    /**
     * ユーザーがルームに参加しているかチェック
     */
    boolean existsByRoomIdAndUserId(Integer roomId, Integer userId);
}
