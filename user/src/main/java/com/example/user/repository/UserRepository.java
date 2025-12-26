package com.example.user.repository;

import com.example.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    /**
     * ユーザー名でユーザーを検索
     */
    Optional<User> findByUsername(String username);

    /**
     * メールアドレスでユーザーを検索
     */
    Optional<User> findByEmail(String email);

    /**
     * ユーザーが有効かどうかを確認
     */
    boolean existsByIdAndIsActiveTrue(Integer id);
}
