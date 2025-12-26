package com.example.BFF.repository;

import com.example.BFF.entity.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserTokenRepository extends JpaRepository<UserToken, String> {

    /**
     * 有効期限が切れたトークンを検索
     */
    List<UserToken> findByExpiryDateBefore(LocalDateTime expiryDate);

    /**
     * 有効期限が切れたトークンを削除
     */
    long deleteByExpiryDateBefore(LocalDateTime expiryDate);
}
