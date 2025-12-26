package com.example.chat.repository;

import com.example.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {

    /**
     * ルームIDでメッセージを検索
     */
    List<ChatMessage> findByRoomId(Integer roomId);

    /**
     * ルームIDでメッセージをページング検索（最新順）
     */
    Page<ChatMessage> findByRoomIdOrderByCreatedAtDesc(Integer roomId, Pageable pageable);

    /**
     * 送信者IDでメッセージを検索
     */
    List<ChatMessage> findBySenderId(Integer senderId);

    /**
     * ルームIDのメッセージ数をカウント
     */
    long countByRoomId(Integer roomId);
}
