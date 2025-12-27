package com.example.chat.repository;

import com.example.chat.entity.RoomMember;
import com.example.chat.entity.RoomMemberId;
import com.example.chat.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomMemberRepository extends JpaRepository<RoomMember, RoomMemberId> {

    /**
     * ルームのメンバーを検索
     */
    List<RoomMember> findByRoom(Room room);

    /**
     * ユーザーIDで参加しているルームを検索
     */
    List<RoomMember> findByUserId(Integer userId);

    /**
     * ルームとユーザーIDで検索
     */
    Optional<RoomMember> findByRoomAndUserId(Room room, Integer userId);

    /**
     * ルームのメンバー数をカウント
     */
    long countByRoom(Room room);

    /**
     * ユーザーがルームに参加しているかチェック
     */
    boolean existsByRoomAndUserId(Room room, Integer userId);
}
