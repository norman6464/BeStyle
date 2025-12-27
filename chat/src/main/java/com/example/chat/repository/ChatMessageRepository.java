package com.example.chat.repository;

import com.example.chat.entity.ChatMessage;
import com.example.chat.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {

    /**
     * ルームのメッセージを検索
     */
    List<ChatMessage> findByRoom(Room room);

    /**
     * ルームのメッセージをページング検索（最新順）
     */
    Page<ChatMessage> findByRoomOrderByCreatedAtDesc(Room room, Pageable pageable);

    /**
     * 送信者IDでメッセージを検索
     */
    List<ChatMessage> findBySenderId(Integer senderId);

    /**
     * ルームのメッセージ数をカウント
     */
    long countByRoom(Room room);
}
