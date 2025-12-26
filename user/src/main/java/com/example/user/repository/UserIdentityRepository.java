package com.example.user.repository;

import com.example.user.entity.UserIdentity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserIdentityRepository extends JpaRepository<UserIdentity, Integer> {

    /**
     * ユーザーIDで外部認証情報を検索
     */
    List<UserIdentity> findByUserId(Integer userId);

    /**
     * プロバイダーと外部識別子で検索
     */
    Optional<UserIdentity> findByProviderAndProviderId(String provider, String providerId);

    /**
     * ユーザーIDとプロバイダーで削除
     */
    void deleteByUserIdAndProvider(Integer userId, String provider);
}
