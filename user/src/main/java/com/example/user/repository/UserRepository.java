package com.example.user.repository;

import com.example.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    /**
     * Cognitoサブでユーザーを検索
     */
    Optional<User> findByCognitoSub(String cognitoSub);

    /**
     * ユーザー名でユーザーを検索
     */
    Optional<User> findByUsername(String username);

    /**
     * メールアドレスでユーザーを検索
     */
    Optional<User> findByEmail(String email);

    /**
     * ステータスでユーザーを検索
     */
    Optional<User> findByIdAndStatus(Integer id, String status);
}
