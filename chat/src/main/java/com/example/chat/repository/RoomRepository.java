package com.example.chat.repository;

import com.example.chat.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {

    /**
     * ルーム名で検索
     */
    Optional<Room> findByName(String name);

    /**
     * ルーム名で検索（部分一致）
     */
    List<Room> findByNameContaining(String name);
}
